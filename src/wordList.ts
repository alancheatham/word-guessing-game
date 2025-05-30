// Word list organized by categories, all words are at least 8 letters long
const CATEGORIES = {
	nature: [
		'elephant',
		'butterfly',
		'mountain',
		'flamingo',
		'penguin',
		'waterfall',
		'dolphin',
		'cheetah',
		'squirrel',
		'gorilla',
		'crocodile',
		'octopus',
		'panther',
		'giraffe',
		'rhinoceros',
		'kangaroo',
		'porcupine',
		'hedgehog',
		'albatross',
		'seahorse',
		'jellyfish',
		'dragonfly',
		'scorpion',
		'peacock',
	],
	technology: [
		'computer',
		'keyboard',
		'satellite',
		'telescope',
		'software',
		'internet',
		'wireless',
		'robotics',
		'database',
		'processor',
		'bluetooth',
		'platform',
		'algorithm',
		'interface',
		'broadband',
		'encryption',
		'microchip',
		'operating',
		'analytics',
		'dashboard',
		'firewall',
		'protocol',
		'hardware',
		'compiler',
	],
	food: [
		'spaghetti',
		'chocolate',
		'pancakes',
		'lasagna',
		'pineapple',
		'blueberry',
		'mushroom',
		'sandwich',
		'broccoli',
		'asparagus',
		'eggplant',
		'cranberry',
		'tangerine',
		'avocado',
		'zucchini',
		'artichoke',
		'cucumber',
		'cinnamon',
		'pepperoni',
		'ravioli',
	],
	activities: [
		'baseball',
		'football',
		'swimming',
		'climbing',
		'exercise',
		'training',
		'jogging',
		'wrestling',
		'painting',
		'studying',
		'gardening',
		'traveling',
		'shopping',
		'dancing',
		'skydiving',
		'snorkeling',
		'meditation',
		'volleyball',
		'basketball',
		'gymnastics',
	],
	arts: [
		'painting',
		'symphony',
		'orchestra',
		'sculpture',
		'theater',
		'festival',
		'musical',
		'creative',
		'artistic',
		'dramatic',
		'literature',
		'photography',
		'animation',
		'composing',
		'designing',
		'directing',
		'performing',
		'sketching',
		'decorating',
		'illustrate',
	],
	places: [
		'hospital',
		'mountain',
		'building',
		'airport',
		'library',
		'museum',
		'castle',
		'palace',
		'mansion',
		'cathedral',
		'landmark',
		'university',
		'restaurant',
		'sanctuary',
		'aquarium',
		'laboratory',
		'skyscraper',
		'lighthouse',
		'monastery',
		'colosseum',
	],
	objects: [
		'umbrella',
		'furniture',
		'bookshelf',
		'painting',
		'curtains',
		'computer',
		'notebook',
		'backpack',
		'suitcase',
		'telescope',
		'binoculars',
		'chandelier',
		'microscope',
		'projector',
		'turntable',
		'amplifier',
		'thermostat',
		'calculator',
		'microphone',
		'instrument',
	],
	abstract: [
		'freedom',
		'mystery',
		'courage',
		'passion',
		'harmony',
		'justice',
		'strength',
		'patience',
		'kindness',
		'knowledge',
		'infinity',
		'eternity',
		'ambition',
		'curiosity',
		'integrity',
		'serenity',
		'gratitude',
		'confidence',
		'resilience',
		'optimism',
	],
	professions: [
		'scientist',
		'professor',
		'architect',
		'developer',
		'designer',
		'musician',
		'surgeon',
		'attorney',
		'journalist',
		'detective',
		'therapist',
		'astronaut',
		'conductor',
		'pharmacist',
		'accountant',
		'consultant',
		'researcher',
		'instructor',
		'navigator',
		'technician',
	],
}

// Create a flat array of all words for the game
export const WORD_LIST = Object.values(CATEGORIES).flat()

// Export categories for hint functionality
export const getWordCategory = (word: string): string => {
	for (const [category, words] of Object.entries(CATEGORIES)) {
		if (words.includes(word.toLowerCase())) {
			return category
		}
	}
	return 'general'
}
