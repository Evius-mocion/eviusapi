export enum ExperienceCategoryEnum {
	PHYSICAL_SPORTS = 'physical_sports',
	VIRTUAL_INTERACTIVE = 'virtual_interactive',
	CREATIVE_ARTISTIC = 'creative_artistic',
	AUGMENTED_REALITY = 'augmented_reality',
	EXHIBITIONS_OR_DEMOS = 'exhibitions_or_demos',
}

export interface ExperienceFieldDefinition {
	name: string;
	label: string;
	type: 'string' | 'number' | 'boolean';
}


