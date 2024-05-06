import service from '@/utils/request'

export const useSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/aidet/tts/sv2tts', dataForm)
	} else {
		return service.post('/aidet/tts/sv2tts', dataForm)
	}
}

export const deleteTableInfoApi = (tableName: any) => {
	return service.delete('/aidet/tts/delete/' + tableName)
}

