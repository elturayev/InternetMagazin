import jwt from 'jsonwebtoken'

function tokenParser ({req,res}){
	try{
		if(!req.headers.token)throw new Error('Not token!')
		return req.headers
	}catch(error){
		return error.message
	}

}
export default tokenParser

