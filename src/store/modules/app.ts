import { defineStore } from 'pinia'
import { ITheme } from '@/store/theme/interface'
import cache from '@/utils/cache'
import { useDictTypeAllApi } from '@/api/sys/dict'
import { listAllUserApi } from '@/api/sys/user'
import { listAllOrgApi } from '@/api/sys/orgs'

export const appStore = defineStore('appStore', {
	state: () => ({
		// sidebar 是否展开
		sidebarOpened: cache.getSidebarOpened(),
		// 国际化
		language: cache.getLanguage(),
		// 组件大小
		componentSize: cache.getComponentSize(),
		// 字典列表
		dictList: [],
		//当前用户的项目列表
		projectList: [],
		//部门列表
		orgList: [],
		//用户列表
		sysUserList: [],
		// 主题
		theme: cache.getTheme()
	}),
	actions: {
		setSidebarOpened() {
			this.sidebarOpened = !this.sidebarOpened
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setLanguage(locale: string) {
			this.language = locale
			cache.setLanguage(locale)
		},
		setComponentSize(size: string) {
			this.componentSize = size
			cache.setComponentSize(size)
		},
		async getDictListAction() {
			const { data } = await useDictTypeAllApi()
			this.dictList = data || []
		},
		async getProjectListAction() {
			// const { data } = await currentUserProjectsApi()
			// this.projectList = data || []
		},
		async getSysUserListAction() {
			const { data } = await listAllUserApi()
			this.sysUserList = data || []
		},
		async getSysOrgListAction() {
			const { data } = await listAllOrgApi()
			this.orgList = data || []
		},
		setTheme(theme: ITheme) {
			this.theme = theme
			cache.setTheme(theme)
		}
	}
})
