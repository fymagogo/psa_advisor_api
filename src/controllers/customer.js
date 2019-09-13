const config = require('../utilities/config')
const pool = config.pool

const getCustomer = (Request, Response) => {
    pool.query('SELECT * FROM customer ORDER BY id ASC', 
        (error, results) => {
            if (error) {
                Response.status(400).json({error})
            }
            if (!Array.isArray(results.rows) || !results.rows.length){
                return Response.status(400).json({
                    result:"Customer not found",
                });
            }else {
                Response.status(200).json(results.rows)
            }
            
        }
    )
}

const getCustomerById = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Customer not found")
            return Response.status(400).json({
                result:"Customer not found",
           })
        }
        let customer = results.rows[0];

        if (customer == null){
            return Response.status(400).send({result: null});
         }
         if (typeof customer === 'string' || customer instanceof String){
            return Response.status(400).json({
                 result:"Customer not found",
            })
         }
     
        return Response.status(200).send({
             result: customer
         })
    } catch (error) {
        return Response.status(400).json({
            error: error
        })
        
    }
}

const createCustomer = (Request, Response) => {
    const { full_name, age, gender, relationship_status,
            monthly_income, current_savings, date_of_birth,
            email, mobile_number
        } = Request.body
    const dateOfBirth = new Date(date_of_birth)
    const dateCreated = 'NOW'
    
    pool.query('INSERT INTO customer (full_name, age, gender, relationship_status,monthly_income, current_savings, date_of_birth, created_date, email, mobile_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
        [full_name, age, gender, relationship_status,
            monthly_income, current_savings, dateOfBirth,
            dateCreated, email, mobile_number], (error,results) => {
                if (error){
                    Response.status(400).json({error});
                }
                
                let customer = results.rows[0];

               Response.status(201).send({
                    status: "Customer has been successfully created.",
                    result: customer,

                });
                
            }
        )
}

const updateCustomer = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Customer not found")
            return Response.status(400).json({
                result:"Customer not found",
           })
        }
        const { full_name, age, gender, relationship_status,
            monthly_income, current_savings, date_of_birth,
            email, mobile_number
        } = Request.body
        const dateOfBirth = new Date(date_of_birth)
    
        pool.query('UPDATE customer SET full_name = $1, age = $2, gender = $3, relationship_status = $4, monthly_income = $5,current_savings = $6, date_of_birth = $7, email = $8, mobile_number = $9 WHERE id = $10 RETURNING *',
        [full_name, age, gender, relationship_status,
            monthly_income, current_savings, dateOfBirth,
             email, mobile_number,id], (error, results) =>{
                if (error){
                    Response.status(400).json({error});
                }
                let customer = results.rows[0];
            
                Response.status(200).send({
                    status: `Customer with id ${id} has been modified`,
                    result: customer,
                    })
            }
    
        )
         
    } catch (error) {
        return Response.status(400).json({
            error: error})
    }



    
}

const deleteCustomer = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Customer not found")
            Response.status(404).send({result:'Customer not found'})
        }
        
        pool.query('DELETE FROM customer WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            Response.status(200).send({result:`Customer with id ${id} has been deleted`})
        })

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }

    
}

function getbyid(id) {
    return new Promise((res, rej)=> {
        pool.query('SELECT * FROM customer WHERE id = $1', [id], (err, result) => {
            if (err) return rej(err)
            console.log("gotten customer info")
            res(result)
        }
        
    )    
    })
}


module.exports = {
    getCustomer,getCustomerById,
    createCustomer,updateCustomer,
    deleteCustomer,getbyid
}
