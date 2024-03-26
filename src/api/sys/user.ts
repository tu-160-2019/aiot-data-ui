import service from '@/utils/request'

export const useUserInfoApi = () => {
	return service.get('/sys/user/info')
}

export const updatePasswordApi = (data: any) => {
	return service.put('/sys/user/password', data)
}

export const useUserApi = (id: number) => {
	return service.get('/sys/user/' + id)
}

export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/user', dataForm)
	} else {
		return service.post('/sys/user', dataForm)
	}
}

export const listAllUserApi = () => {
	return service.get('/sys/user/list-all')
}

export const listUserApi = () => {
	return service.get('/sys/user/list-users')
}
