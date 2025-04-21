export enum MicrophoneMode {
	OPEN = 'OPEN',
	CONTROLLED = 'CONTROLLED',
}

export enum RequestOfMeetingStatus {
	REQUESTED = 'requested',
	REJECTED = 'rejected',
	ACCEPTED = 'accepted',
}

export interface MeetingConfig {
	chat_open?: boolean;
	enable_face_to_face_chat?: boolean;
	video_call_enabled?: boolean;
	screen_share_enabled?: boolean;
	raise_hand_enabled?: boolean;
	max_quantity_per_called?: number;
	meeting_time?: number;
}
