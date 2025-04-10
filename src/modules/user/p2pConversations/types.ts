export interface P2PConversation {
    uid: string
    username?: string
    body?: string
    image?: P2PConversationImage
    created_at?: string
    status?: string
    supporter: boolean
}

export interface P2PConversationImage {
    url: string
}
