export interface EventExperiencePlayDataExcel {
	play_timestamp: string;
	eventExperienceId?: string;
	experienceId: string;
	score: number;
	bonusScore: number;
	local_id: string;
	data: ExperiencePlayData | string;
	attendeeId?: string;
	email?: string;
}

export interface ExperiencePlayData {
	// General gamification data
	totalScore?: number; // Total accumulated score
	totalBonusScore?: number; // Accumulated bonus score
	maxSpeed?: number; // Maximum speed reached (Cycling and running)
	averageSpeed?: number; // Average speed (Cycling and running)
	maxGoals?: number; // Maximum goals per match (powershot and soccer shootout)

	// Simulators
	distanceTraveled?: number; // Average distance traveled per user
	maxDistanceTraveled?: number; // Maximum distance by a user

	// Virtual/interactive - driving simulators
	reactionTime?: number; // Average reaction time
	brakingDistance?: number; // Average braking distance

	// Discover 360 objects
	discoveredObjectsCount?: number; // Number of objects found
	searchTimePerObject?: number; // Average search time per object

	// Creative/artistic
	paintingTime?: number; // Average time to create a painting

	// Augmented reality
	boothPhotosTaken?: number; // Number of photos taken in Photo Booth
	filtersUsedCount?: number; // Filters used in AR experiences

	// Exhibitions or demos
	productRecommendationsCount?: number; // Most recommended products in Holography/Product Recommender

	// Surveys / trivia
	correctAnswersCount?: number; // Number of correct answers
	detailedAnswers?: Record<string, any>; // Detailed answers per user (you can define more specific types if you want)
	averageResponseTime?: number; // Average response time

	// Demographic information (although it actually comes from the registration form, included here for context)
	location?: string;
	gender?: string;
	age?: number;
	education?: string;

	// General timestamps
	playTimestamp?: string; // ISO date string
}
