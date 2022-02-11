import fetch from '../../utils/postgres.js'

const orderAd = `
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
	GROUP BY o.order_id, u.user_name
	OFFSET $1 LIMIT $2;
`

const loginA = `
	SELECT 
		u.user_id,
		u.user_name
	FROM users as u
	WHERE u.user_name = $1 AND u.password = crypt($2, u.password)
`

const addCateg = `
	INSERT INTO categories(category_name) VALUES ($1)
	RETURNING category_id, category_name
`

const changeCateg = `
	UPDATE categories SET category_name = $2
	WHERE category_id = $1
	RETURNING category_id, category_name
`

const deleteCateg = `
	DELETE FROM categories WHERE category_id = $1
`


const addPrAd = `
	INSERT INTO products(product_name, product_price,product_img,short_description,description,category_id) VALUES
	($1,$2,$3,$4,$5,$6)
	RETURNING product_id, product_name,product_price,product_img,short_description,description,category_id
`

const changePrAd = `
	UPDATE products SET
	product_name = (CASE
		WHEN length($2) > 0 THEN $2
		ELSE product_name
	END),
	product_price = (CASE
		WHEN $3 > 0 THEN $3
		ELSE product_price
	END),
	product_img = (CASE
		WHEN length($4) > 0 THEN $4
		ELSE product_img
	END),
	short_description = (CASE
		WHEN length($5) > 0 THEN $5
		ELSE short_description
	END),
	description = (CASE
		WHEN length($6) > 0 THEN $6
		ELSE description
	END)
	WHERE product_id = $1
	RETURNING product_id, product_name, product_price, product_img,short_description,description;

`

const deletePrAd = `
	DELETE FROM products WHERE product_id = $1
`

const totalM = `
	SELECT
		sum(p.product_price),
		count(p.product_name),
		p.product_name
	FROM orders as o
	LEFT JOIN order_products as op on op.order_id = o.order_id
	LEFT JOIN products as p on p.product_id = op.product_id
	WHERE (o.createTime BETWEEN ('2022-02-01') AND ('2022-02-28')) AND
	o.isPaid = true
	GROUP BY p.product_name
	ORDER BY count(p.product_name) DESC;

`

const unpaid = 	`
	SELECT
		sum(p.product_price)
	FROM orders as o
	LEFT JOIN order_products as op on op.order_id = o.order_id
	LEFT JOIN products as p on p.product_id = op.product_id
	WHERE (o.createTime BETWEEN ('2022-02-01') AND ('2022-02-28')) AND
	o.isPaid = false;
`

// QUERY
const ordersAd = ({page,limit})=> fetch(orderAd,(page-1)*limit,limit)
const statistic = ()=> fetch(totalM)
const unPaid = ()=> fetch(unpaid)

// MUTATION
const loginAdmin = ({username,password})=> fetch(loginA,username,password)
const addCategory = ({categoryName})=> fetch(addCateg,categoryName)
const changeCategory = ({ categoryId,categoryName})=> fetch(changeCateg,categoryId,categoryName)
const deleteCategory = ({categoryId})=> fetch(deleteCateg,categoryId)
const addProductAd = ({product_name, product_price,fileName,short_description,description,category_id})=> {
	return fetch(addPrAd,product_name, product_price,fileName,short_description,description,category_id)
}
const updateProductAd = ({product_id,product_name, product_price,fileName,short_description,description})=> {
	return fetch(changePrAd,product_id,product_name, product_price,fileName,short_description,description)
}

const deleteProductAd = ({product_id})=> fetch(deletePrAd,product_id)


export default {
	ordersAd,
	statistic,
	unPaid,
	loginAdmin,
	addCategory,
	changeCategory,
	deleteCategory,
	addProductAd,
	updateProductAd,
	deleteProductAd
}