<template>
	<el-select :disabled="disabled" :model-value="modelValue" :placeholder="placeholder" :clearable="clearable" @change="$emit('update:modelValue', $event)">
		<el-option v-for="data in store.appStore.projectList" :key="data.id" :label="data.name" :value="data.id">{{ data.name }}</el-option>
	</el-select>
</template>

<script setup lang="ts" name="FastProjectSelect">
	
import store from '@/store'

const props = defineProps({
	modelValue: {
		type: [Number, String],
		required: true
	},
	clearable: {
		type: Boolean,
		required: false,
		default: () => false
	},
	disabled: {
		type: Boolean,
		required: false,
		default: () => false
	},
	placeholder: {
		type: String,
		required: false,
		default: () => ''
	}
})
</script>
