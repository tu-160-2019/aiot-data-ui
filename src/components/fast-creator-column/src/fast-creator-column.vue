<template>
	<el-table-column
		:prop="prop"
		:label="label"
		:header-align="headerAlign"
		:align="align"
		:width="width"
		:min-width="minWidth"
		:class-name="className"
	>
		<template #default="scope">
			{{ getNameByUserId(store.appStore.sysUserList, scope.row[props.prop]) }}
		</template>
	</el-table-column>
</template>

<script setup lang="ts" name="FastCreatorColumn">
	
import store from '@/store'
import { getNameByUserId } from '@/utils/tool'

const props = defineProps({
	prop: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	headerAlign: {
		type: String,
		required: false,
		default: () => 'center'
	},
	align: {
		type: String,
		required: false,
		default: () => 'center'
	},
	width: {
		type: String,
		required: false,
		default: () => ''
	},
	minWidth: {
		type: String,
		required: false,
		default: () => ''
	},
	className: {
		type: String,
		required: false,
		default: () => ''
	}
})
</script>
