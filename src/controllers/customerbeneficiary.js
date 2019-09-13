const config = require('../utilities/config')
const pool = config.pool
const customer = require('./customer')

const getCustomerBeneficiary = (Request,Response) => {
    pool.query('SELECT * FROM customer_beneficiary ORDER BY id ASC', 
        (error, results) => {
            if (error) {
                Response.status(400).json({error})
            }
            if (!Array.isArray(results.rows) || !results.rows.length){
                return Response.status(400).json({
                    result:"Beneficiary not found",
                });
            }else {
                Response.status(200).json(results.rows)
            }
        }
    )
}

const getCustomerBeneficiaryById = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        const results = await getbeneficiarybyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            return Response.status(400).json({
                result:"Beneficiary not found",
            });
        }
        let customerbeneficiary = results.rows[0];

        if (customerbeneficiary == null){
            return Response.status(400).send({result: null});
         }

         return Response.status(200).send({
            result: customerbeneficiary
         })

    } catch (error) {
        return Response.status(400).json({
            error: error
        })
    }
}

const createCustomerBeneficiary = async(Request, Response) => {
    try {
        const { name,age,customer_id
        } = Request.body
        const results = await customer.getbyid(customer_id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Customer not found")
            return Response.status(400).json({
                result:"Customer not found",
           })
        }
        
        
    pool.query('INSERT INTO customer_beneficiary (name, age, customer_id) VALUES ($1,$2,$3) RETURNING *',
        [name,age,customer_id], (error,results) => {
                if (error){
                    Response.status(400).json({error});
                }
                

               Response.status(201).send({
                    status: "Customer Beneficiary has been successfully created.",
                    result: results.rows[0],

                });
                
            }
        )

    } catch (error) {
        
    }


    
}

const updateCustomerBeneficiary = async(Request, Response) => {
    const id = parseInt(Request.params.id)
    const { name,age,customer_id
    } = Request.body

    try {
        
        const results = await getbeneficiarybyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Beneficiary not found")
            return Response.status(400).json({
                result:"Beneficiary not found",
           })
        }

        pool.query('UPDATE customer_beneficiary SET name = $1, age = $2, customer_id = $3 WHERE id = $4 RETURNING *',
    [name,age,customer_id,id], (error, results) =>{
            if (error){
                throw error
            }
            Response.status(200).send({
                status: `Customer beneficiary with id ${id} has been modified`,
                result: results.rows[0]
            })
        }

    )

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }
    

    
}

const deleteCustomerBeneficiary = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        
        const results = await getbeneficiarybyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("Beneficiary not found")
            return Response.status(400).json({
                result:"Beneficiary not found",
           })
        }

        pool.query('DELETE FROM customer_beneficiary WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            Response.status(200).json({result:`Customer beneficairy with id ${id} has been deleted successfully`})
        })

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }

    
}


function getbeneficiarybyid(id) {
    return new Promise((res, rej)=> {
        pool.query('SELECT * FROM customer_beneficiary WHERE id = $1', [id], (err, result) => {
            if (err) return rej(err)
            res(result)
        }
    )    
    })
}

module.exports = {
    getCustomerBeneficiary,getCustomerBeneficiaryById,
    createCustomerBeneficiary,updateCustomerBeneficiary,
    deleteCustomerBeneficiary
}