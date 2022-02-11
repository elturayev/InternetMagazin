import model from "./model.js"
import jwt from "jsonwebtoken"

export default {
	Query:{
		categories:  (_,{categoryId,search,pagination:{page,limit}})=> {
			return model.categories({categoryId,search,page,limit})},

		products: (_,{productId,search,pagination:{page,limit}})=> model.products({productId,search,page,limit}),
		
		ordersUs: (_,args,context)=> {
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(!userId)throw new Error("Token invalid!")
				return model.ordersUser({userId})
			}catch(error){
				return error.message
			}
		}
	},

	Category: {
		categoryId: parrent=> parrent.category_id,
		categoryName: parrent=> parrent.category_name
	},
	
	Product:{
		productId: parrent => parrent.product_id,
		productName: parrent => parrent.product_name,
		productPrice: parrent => parrent.product_price,
		productImg: parrent => parrent.product_img,
		shortDescription: parrent => parrent.short_description,
		description: parrent => parrent.description,
		category: parrent => parrent.category_name
	},

	Orders: {
		orderId: parrent => parrent.order_id,
		username: parrent => parrent.user_name,
		products: parrent => parrent.products,
		isPaid: parrent => parrent.ispaid,
		totalMoney: parrent => parrent.totalmoney,
		createTime: parrent => parrent.createtime
	},

	Mutation: {
		login: async (_,{username, password})=>{
			try{
				const data = await model.loginUser({username,password})
				const user = data[0]
				if(!user)throw new Error("User not found!")
				return {
					status:200,
					message: "The user has successfully logged!",
					token: jwt.sign({userId: user.user_id},"secret_key")
				}
			}catch(error){
				return {
					status: 401,
					message: error.message,
					token: "No token!"
				}
			}
		},

		register: async (_,{username,password,contact,email="Not email!"})=>{
			try{
				const data = await model.registerUser({username,password,contact,email})
				const newUser = data[0]
				if(!newUser)throw new Error("The user not added!")
				return {
					status:201,
					message: "The user has successfully registered!",
					token: jwt.sign({userId:newUser.user_id},"secret_key")
				}
			}catch(error){
				return {
					status: 401,
					message: error.message,
					token: "No token!"
				}
			}
		},

		addOrder: async (_,{productId},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				const order = await model.validOrder({userId})
				if(order.length > 0){
					let orderId = order[0].order_id
					model.addProduct({orderId,productId})
				}
				if(order.length == 0){
					const data = await model.addOrder({userId})
					let orderId = data[0].order_id
					model.addProduct({orderId,productId})
				}
				return {
					status: 201,
					message: "The product has successfully added!"
				}
			}catch(error){
				return {
					status: 400,
					message: error.message
				}
			}
		},

		deleteProduct: async (_,{orderId, productName }, context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				const orderPrs = await model.orderProduct()
				const orderPr = orderPrs.find(el=>{
					if(orderId == el.order_id && productName == el.product_name && el.ispaid == false){
						return el
					}
				})
				if(!orderPr)throw new Error("The orderId or productName error entered!")
				model.deleteProduct(orderPr.orderprid)
				return {
					status: 200,
					message: "The product was successfully removed from the order!"
				}
			}catch(error){
				return {
					status: 400,
					message: error.message
				}
			}
		},

		deleteOrder: (_,{orderId},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				model.deleteOrder({userId,orderId})
				return {
					status: 200,
					message: "The order has successfully deleted!"
				}
			}catch(error){
				return {
					status: 400,
					message: error.message
				}
			}
		},

		payOrder: async (_,{orderId},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				const updatedOrder = await model.payOrder({userId,orderId})
				return {
					status: 200,
					message:"The order has successfully paided!",
					data: updatedOrder
				}
			}catch(error){
				return{
					status: 400,
					message: error.message,
					data: null
				}
			}
		}
	}
}