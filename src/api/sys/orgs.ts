import service from '@/utils/request'

export const useOrgListApi = (parentId: any) => {
	if(parentId) {
		return service.get('/sys/org/list?parentId='+parentId)
	} 
	return service.get('/sys/org/list')
}

export const useOrgApi = (id: Number) => {
	return service.get('/sys/org/' + id)
}

export const useOrgSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/org', dataForm)
	} else {
		return service.post('/sys/org', dataForm)
	}
}

export const listAllOrgApi = () => {
	return service.get('/sys/org/list-all')
}
