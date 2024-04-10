import type { App } from 'vue'
import { auth } from './auth'

import copyText from './iot/directive/common/copyText'
import { hasPermi, hasRoles } from './iot/directive/permission'

export const directive = (app: App) => {
	// 权限指令
	auth(app)
	app.directive('copyText', copyText)
	app.directive('hasPermi', hasPermi)
	app.directive('hasRoles', hasRoles)
}
