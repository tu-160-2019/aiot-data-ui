import type { App, Plugin } from 'vue'

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
	return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}

// 是否外链
export const isExternalLink = (url: string): boolean => {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

// 替换外链参数
export const replaceLinkParam = (url: string): string => {
	return url.replace('{{apiUrl}}', constant.apiUrl)
}

// 转换文件大小格式
export const convertSizeFormat = (size: number): string => {
	const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	let index = Math.floor(Math.log(size) / Math.log(1024))
	let newSize = size / Math.pow(1024, index)

	// 保留的小数位数
	return newSize.toFixed(2) + ' ' + unit[index]
}

// 获取svg图标(id)列表
export const getIconList = (): string[] => {
	const rs: string[] = []
	const list = document.querySelectorAll('svg symbol')
	for (let i = 0; i < list.length; i++) {
		rs.push(list[i].id)
	}
	return rs
}

// 获取字典Label
export const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
		if (val) {
			return val.dictLabel
		} else {
			return dictValue
		}
	} else {
		return dictValue
	}
}

// 获取字典数据列表
export function getDictDataList(dictList: any[], dictType: string) {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		return type.dataList
	} else {
		return []
	}
}

// 获取项目名称
export const getValByProjectId = (projectList: any[], projectId: number) => {
	const project = projectList.find((element: any) => element.id === projectId)
	if (project) {
		const projectVal = project.name
		if (projectVal) {
			return projectVal
		} else {
			return projectId
		}
	} else {
		return projectId
	}
}

// 获取部门名称
export const getValByOrgId = (orgList: any[], orgId: number) => {
	const org = orgList.find((element: any) => element.id === orgId)
	if (org) {
		const orgVal = org.name
		if (orgVal) {
			return orgVal
		} else {
			return ''
		}
	} else {
		return orgId
	}
}


// 获取用户名称
export const getNameByUserId = (sysUserList: any[], userId: number) => {
	const user = sysUserList.find((element: any) => element.id === userId)
	if (user) {
		const username = user.username
		if (username) {
			return username
		} else {
			return userId
		}
	} else {
		return userId
	}
}

// 全局组件安装
export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName, component)
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}
	return component as T & Plugin
}
