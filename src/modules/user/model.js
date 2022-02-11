import fetch from '../../utils/postgres.js'

const category = `
	SELECT
		*
	FROM categories as c
	WHERE
	CASE
		WHEN $1 > 0 THEN c.category_id = $1
		ELSE true
	END AND
	CASE
		WHEN length($2) > 0 THEN c.category_name ilike concat('%',$2,'%')
		ELSE true
	END
	ORDER BY category_id
	OFFSET $3 LIMIT $4
`

const product = `
	SELECT 
		p.product_id,
		p.product_name,
		p.product_price,
		p.product_img,
		p.short_description,
		p.description,
		c.category_name
	FROM products as p
	LEFT JOIN categories as c on c.category_id = p.category_id
	WHERE
	CASE
		WHEN $1 > 0 THEN p.product_id = $1
		ELSE true
	END AND
	CASE
		WHEN length($2) > 0 THEN p.product_name ilike concat('%',$2,'%')
		ELSE true
	END
	GROUP BY p.product_id, c.category_name
	ORDER BY p.product_id
	OFFSET $3 LIMIT $4
`

const orderPr = `
	SELECT 
		op.*,
		p.product_name,
		o.isPaid
	FROM order_products as op
	LEFT JOIN products as p on op.product_id = p.product_id
	LEFT JOIN orders as o on o.order_id = op.order_id
`

const login = `
	SELECT 
		u.user_id,
		u.user_name
	FROM users as u
	WHERE u.user_name = $1 AND u.password = crypt($2, u.password)
`

const register = `
	INSERT INTO users (user_name,password,contact,email) VALUES
	($1,crypt($2, gen_salt('bf')),$3,$4)
	RETURNING user_id, user_name,password,contact,email;
`

const validOr = `
	SELECT
		o.order_id
	FROM orders as o
	WHERE o.user_id = $1 AND isPaid = false
`

const addOr = `
	INSERT INTO orders (user_id) VALUES ($1)
	RETURNING order_id
`

const addPr = `
	INSERT INTO order_products (order_id, product_id) VALUES ($1,$2)

`

const orderUser = `
	SELECT
		o.order_id,
		u.user_name,
		json_agg(p.product_name) as products,
		o.isPaid,
		sum(p.product_price) as totalMoney,
		o.createTime
	FROM orders as o
	LEFT JOIN users as u on u.user_id = o.user_id
	LEFT JOIN order_products as op on op.order_id = o.order_id
	LEFT JOIN products as p on p.product_id = op.product_id
	WHERE o.user_id = $1
	GROUP BY o.order_id, u.user_name
	ORDER BY o.order_id;
`


const deleteOr = `
	DELETE FROM orders as o 
	WHERE isPaid = false AND o.user_id = $1 AND o.order_id = $2
`

const deletePr = `
	DELETE FROM order_products as op
	WHERE op.orderPrId = $1
`

const payOr = `
	UPDATE orders
	SET isPaid = true
	WHERE user_id = $1 AND order_id = $2
	RETURNING order_id, user_id, isPaid
`

// QUERY
const categories = ({categoryId,search,page,limit})=> fetch(category,categoryId,search,(page-1)*limit,limit)
const products = ({productId,search,page,limit})=> fetch(product,productId,search,(page-1)*limit,limit)
const ordersUser = ({userId})=> fetch(orderUser,userId)
const orderProduct = ()=> fetch(orderPr)

// MUTATION
const loginUser = ({username,password})=> fetch(login,username,password)
const registerUser = ({username,password,contact,email})=> fetch(register,username,password,contact,email)
const validOrder = ({userId}) => fetch(validOr,userId)
const addOrder = ({userId})=> fetch(addOr,userId)
const deleteOrder = ({userId,orderId})=> fetch(deleteOr,userId,orderId)
const payOrder = ({userId,orderId})=> fetch(payOr,userId,orderId)
const addProduct = ({orderId,productId})=> fetch(addPr,orderId,productId)
const deleteProduct = (orderPrId)=> fetch(deletePr,orderPrId)

export default {
	categories,
	products,
	ordersUser,
	orderProduct,
	loginUser,
	registerUser,
	validOrder,
	addOrder,
	deleteOrder,
	payOrder,
	addProduct,
	deleteProduct
}