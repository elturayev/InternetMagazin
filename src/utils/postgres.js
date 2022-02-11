import pg from 'pg'

const pool = new pg.Pool({
	connectionString: 'postgres://nbxcekhq:oQWUMo4q4HJNepXN2MyxlM12EIMeu25K@john.db.elephantsql.com/nbxcekhq'
})

async function fetch(query,...params){
	const client = await pool.connect()
	try{
		const { rows } = await client.query(query, params.length ? params : null)
		return rows
	}catch(error){
		console.log(error)
	} finally{
		client.release()
	}
}

export default fetch