module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'plugin:prettier/recommended',
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		'plugin:@typescript-eslint/recommended',
		'./.eslintrc-auto-import.json'
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2022,
		ecmaFeatures: {
			jsx: true
		},
		jsxPragma: 'React',
		sourceType: 'module'
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		curly: 'error', // 控制语句需要大括号
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'vue/no-v-model-argument': 'off',
		// 'indent': ['error', 2],
		'semi': [2, 'never'], // 结尾分号
		'quotes': [2, 'single', 'avoid-escape'],
		'@typescript-eslint/no-this-alias': 'error',
		'@typescript-eslint/ban-types': [
			'error',
			{
				// 关闭空类型检查 {}
				extendDefaults: true,
				types: {
					'{}': false
				}
			}
		]
	},
	globals: {
		DialogOption: 'readonly',
		OptionType: 'readonly'
	}
}
