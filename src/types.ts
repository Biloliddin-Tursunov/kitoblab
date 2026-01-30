export interface Media {
    type: 'photo' | 'file' | 'video' | 'voice';
    src: string;
    href?: string;
    title?: string;
    size?: string;
    duration?: string;
}

export interface Message {
    id: string;
    type: 'service' | 'message';
    text: string;
    date: string | null;
    author?: string;
    time?: string;
    replyTo?: string | null;
    media?: Media | null;
    isJoined?: boolean;
}
