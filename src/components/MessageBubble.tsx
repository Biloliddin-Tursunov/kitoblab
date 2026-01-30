import { File as FileIcon } from 'lucide-react';
import type { Message, Media } from '../types';
import './MessageBubble.css';

interface MessageBubbleProps {
    message: Message;
    showAuthor?: boolean;
}


const MediaContent: React.FC<{ media: Media }> = ({ media }) => {
    if (media.type === 'photo') {
        // The src in JSON is relative "photos/photo_...". 
        // We assume these are served from public/ or handled.
        // The user has a 'publicphotos' folder in the root?
        // list_dir showed 'publicphotos' and 'publicfiles' in ROOT.
        // Vite serves 'public' at root.
        // I might need to adjust paths. 
        // JSON: "src": "photos/..."
        // If photos are in "public/photos", then "/photos/..." works.
        // If they are in "publicphotos", I might need to fix the path.
        // Let's assume standard Vite public folder for now, or map it.
        // User has "publicphotos" folder.
        // I should probably prefix if needed, or maybe the export script moved them.
        // For now, I'll use the raw src.
        return (
            <div className="message-media photo">
                <img src={`/${media.src}`} alt="Message attachment" loading="lazy" />
            </div>
        );
    }
    const isAudio = media.src.toLowerCase().endsWith('.ogg') ||
        media.src.toLowerCase().endsWith('.mp3') ||
        media.type === 'voice';

    if (isAudio) {
        return (
            <div className="message-media audio">
                {media.title && <div className="file-name" style={{ marginBottom: '4px' }}>{media.title}</div>}
                <audio controls src={`/${media.src}`} style={{ width: '100%', height: '32px' }} />
            </div>
        );
    }

    if (media.type === 'file') {
        return (
            <div className="message-media file">
                <div className="file-icon"><FileIcon size={20} /></div>
                <div className="file-info">
                    <div className="file-name">{media.title || 'Unknown file'}</div>
                    <div className="file-size">{media.size}</div>
                </div>
            </div>
        )
    }
    return null;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAuthor }) => {
    if (message.type === 'service') {
        return (
            <div className="service-message-container" id={message.id}>
                <span
                    className="service-message-badge"
                    onClick={() => {
                        // If it's a date or has an ID, we could scroll.
                        // For now just logs, but in App we can handle this better.
                        console.log('Clicked service message:', message.text);
                    }}
                >
                    {message.text}
                </span>
            </div>
        );
    }

    // Render HTML content safely
    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    // If generic channel, maybe align all left. 
    // But let's check if there are other authors.
    // If 'Unknown', probably also left.

    return (
        <div className={`message-row ${message.isJoined ? 'joined' : ''}`}>
            <div className="message-bubble">
                {showAuthor && message.author && message.author !== 'kitoblab.uz' && (
                    <div className="message-author">{message.author}</div>
                )}

                {message.media && <MediaContent media={message.media} />}

                {message.text && (
                    <div
                        className="message-text"
                        dangerouslySetInnerHTML={createMarkup(message.text)}
                    />
                )}

                <div className="message-meta">
                    <span className="message-time">{message.time}</span>
                </div>
            </div>
        </div>
    );
};
