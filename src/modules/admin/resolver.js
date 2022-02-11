import model from "./model.js"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import { finished } from "stream/promises"


export default {
	Query: {
		ordersAd: (_,{pagination:{page,limit}},context)=> {
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("All orders can only be seen by the Admin!")
				return model.ordersAd({page,limit})
			}catch(error){
				return error.message
			}
		},

		Statistic: async (_,args,context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("Statistics can only be seen by the Admin!")
				const total = await model.statistic()
				const unpaid = await model.unPaid()
				let totalPaid = 0
				let totalUnpaid = (unpaid[0].sum > 0 ? unpaid[0].sum : 0)
				if(total[0].sum > 0) {
					let mostProducts = {}
					let lastProducts = {}
					total.map(el=>{
						totalPaid += +el.sum
						if(total[total.length -1].count == el.count) lastProducts[el.product_name] = +el.count
						if(total[0].count == el.count) mostProducts[el.product_name] = +el.count
					})

					return {
						"totalMoneyPaid":totalPaid.toFixed(2) + "$",
						"totalMoneyUnpaid": +totalUnpaid.toFixed(2) + "$",
						"mostProducts": mostProducts,
						"lastProducts": lastProducts
					}
				}
				else return {"totalMoneyPaid": totalPaid, "totalMoneyUnpaid": totalUnpaid, "mostProducts": 0, "lastProducts": 0}
			}catch(error){
				return error.message
			}
		}
	},

	OrdersAd: {
		orderId: parrent => parrent.order_id,
		username: parrent => parrent.user_name,
		products: parrent => parrent.products,
		isPaid: parrent => parrent.ispaid,
		totalMoney: parrent => parrent.totalmoney,
		createTime: parrent => parrent.createtime
	},


	Mutation: {
		loginAd: async (_,{username,password})=>{
			try{
				const admin = await model.loginAdmin({username,password})
				if(!admin.length) throw new Error("Admin not found!")
				return {
					status:200,
					message: "The admin has successfully logged!",
					token: jwt.sign({userId: 1},"secret_key")
				}
			}catch(error){
				return {
					status:401,
					message: error.message,
					token: "No token!"
				}
			}
		},

		addCategory: async (_,{categoryName},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("The category is only added by Admin!")
				const newCategory = await model.addCategory({categoryName})
				return {
					status: 201,
					message: "The category has successfully created!",
					data: newCategory
				}
			}catch(error){
				return {
					status: 400,
					message: error.message,
					data: null
				}
			}
		},

		updatedCategory: async (_,{categoryId,categoryName},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("The category can only be changed by Admin!")
				const updatedCategory = await model.changeCategory({categoryId,categoryName})
				return {
					status: 200,
					message: "The category has successfully updated!",
					data: updatedCategory
				}
			}catch(error){
				return {
					status: 400,
					message: error.message,
					data: null
				}
			}
		},

		deleteCategory: (_,{categoryId},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("The category will only be deleted by Admin!")
				model.deleteCategory({categoryId})
				return {
					status: 200,
					message: "The category has successfully deleted!",
				}
			}catch(error){
				return {
					status: 400,
					message: error.message,
				}
			}
		},

		addProductAd: async (_, {file,product_name, product_price,short_description,description,category_id},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("Only Admin adds the product to the database!")
				const { createReadStream, filename, mimetype, encoding } = await file;
				const fileAddres = path.join(process.cwd(),"src","images",filename)
	      		const stream = createReadStream();
				let fileName = "/images/"+filename
			    const out = fs.createWriteStream(fileAddres);
			    stream.pipe(out);
			    await finished(out);
			    const newProduct = await model.addProductAd({product_name, product_price,fileName,short_description,description,category_id})
	      		return {
	      			status: 201,
	      			message: "The product has successfully created!",
	      			data: newProduct
	      		};
			}catch(error){
				return {
					status: 400,
					message: error.message,
					data: null
				}
			}
		},

		updateProductAd: async (_, {file,product_id,product_name, product_price,short_description,description},context)=>{
			try{

				const { userId } = jwt.verify(context.token,"secret_key")
				let fileName
				if(userId != 1)throw new Error("Only Admin can change the product from the database!")
				if(file){
					const { createReadStream, filename, mimetype, encoding } = await file;
					const fileAddres = path.join(process.cwd(),"src","images",filename)
		      		const stream = createReadStream();
					fileName = "/images/"+filename
				    const out = fs.createWriteStream(fileAddres);
				    stream.pipe(out);
				    await finished(out);
				}
			    const newProduct = await model.updateProductAd({product_id, product_name, product_price,fileName,short_description,description})
	      		return {
	      			status: 201,
	      			message: "The product has successfully updated!",
	      			data: newProduct
	      		};
			}catch(error){
				return {
					status: 400,
					message: error.message,
					data: null
				}
			}
		},

		deleteProductAd: (_,{product_id},context)=>{
			try{
				const { userId } = jwt.verify(context.token,"secret_key")
				if(userId != 1)throw new Error("Only Admin will delete the product from the database!")
				model.deleteProductAd({product_id})
				return {
					status: 200,
					message:"The product has successfully deleted!"
				}

			}catch(error){
				return {
					status: 400,
					message: error.message
				}
			}
		}
	}
}