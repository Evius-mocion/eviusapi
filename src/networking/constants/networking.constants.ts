import { MeetingConfig } from '../interfaces/networking.interface';

export const meetingConfigInitial: MeetingConfig = {
	chat_open: true,
	enable_face_to_face_chat: false,
	video_call_enabled: true,
	screen_share_enabled: true,
	raise_hand_enabled: true,
	max_quantity_per_called: 10,
	meeting_time: 30,
};
