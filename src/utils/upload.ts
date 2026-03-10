import { uploadApi } from "../api/file"

export const uploadFn = async (file: File, cb?: (result?: any) => void) => {
	const data = new FormData()
	data.set("file", file)
	try {
		const res: any = await uploadApi(data)
		const { url, filename, size } = res.data
		const cleanUrl = String(url || '').trim().replace(/^`+|`+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
		const obj = {
			url: cleanUrl,
			name: file.name,
			size: file.size,
			type: file.type,
		}
		cb && cb(cleanUrl)
	} catch (error) {
		cb && cb(error)
	}
}

