export interface ExperiencePlayData {
	// Datos generales de gamificación
	totalScore?: number; // Puntuaje total acumulado
	totalBonusScore?: number; // Puntuaje acumulado de bonificaciones
	maxSpeed?: number; // Velocidad máxima alcanzada (Ciclismo y carrera)
	averageSpeed?: number; // Velocidad promedio (Ciclismo y carrera)
	maxGoals?: number; // Goles máximos por partido (powershot y fútbol tirol)

	// Simuladores
	distanceTraveled?: number; // Distancia recorrida promedio por usuario
	maxDistanceTraveled?: number; // Distancia máxima de un usuario

	// Virtuales/interactivos - simuladores de conducción
	reactionTime?: number; // Tiempo promedio de reacción
	brakingDistance?: number; // Distancia de frenado promedio

	// Descubre objetos 360
	discoveredObjectsCount?: number; // Cantidad de objetos encontrados
	searchTimePerObject?: number; // Tiempo promedio de búsqueda por objeto

	// Creativas/artísticas
	paintingTime?: number; // Tiempo promedio para crear una pintura

	// Realidad aumentada
	boothPhotosTaken?: number; // Número de fotos tomadas en Photo Booth
	filtersUsedCount?: number; // Filtros utilizados en experiencias de RA

	// Exhibiciones o demos
	productRecommendationsCount?: number; // Productos más recomendados en Holografía/Recomendador de producto

	// Encuestas / trivias
	correctAnswersCount?: number; // Número de respuestas correctas
	detailedAnswers?: Record<string, any>; // Detalle de respuestas por usuario (puedes definir mejor si quieres tipos específicos)
	averageResponseTime?: number; // Tiempo promedio de respuesta

	// Información demográfica (aunque realmente viene por registro de formulario, la incluyo por contexto)
	location?: string;
	gender?: string;
	age?: number;
	education?: string;

	// Timestamps generales
	playTimestamp?: string; // ISO date string
}
