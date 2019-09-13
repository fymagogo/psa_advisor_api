const config = require('../utilities/config');
const pool = config.pool;
const Helper = require('../utilities/helper');



const getUsers = (Request,Response) => {
    pool.query('SELECT * FROM users_user ORDER BY id ASC', 
        (error, results) => {
            if (error) {
                Response.status(400).json({error})
            }
            if (!Array.isArray(results.rows) || !results.rows.length){
                return Response.status(400).json({
                    result:"User not found",
                });
            }else {
                Response.status(200).json(results.rows)
            }
        }
    )
}

const getUserById = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            return Response.status(400).json({
                result:"User not found",
            });
        }
        let user = results.rows[0];

        if (user == null){
            return Response.status(400).send({result: null});
         }

         return Response.status(200).send({
            result: user
         })

    } catch (error) {
        return Response.status(400).json({
            error: error
        })
    }
}

const createUser = async(Request, Response) => {
    const { password, username,
            first_name, last_name, email,name
        } = Request.body
    const date_joined = 'NOW'
    const is_superuser = false;
    const is_staff = false;
    const is_active = false;

   try {
    if (!Helper.isValidEmail(email)) {
        return Response.status(400).send({ 'message': 'Please enter a valid email address' });
      }

    const uniqueEmail = await retrieveUserByEmail(email);
    if (uniqueEmail.rows.length >= 1){
        console.log("Email has been used already")
        return Response.status(400).json({
            result:"Email has been used already",
       })
    }  

    const hashedPassword = Helper.hashPassword(password);
        
    pool.query('INSERT INTO users_user (password, is_superuser, username,first_name, last_name, email,is_staff, is_active,date_joined,name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
        [hashedPassword, is_superuser, username,
            first_name, last_name, email,
            is_staff, is_active, date_joined,name], (error,results) => {
                if (error){
                    if (error.routine === '_bt_check_unique') {
                        return Response.status(400).send({ 'message': 'User with that username already exist' })
                      }
                    return Response.status(400).json({error});
                }
                
                let user = results.rows[0];

               return Response.status(201).send({
                    status: "User has been successfully created.",
                    result: user,

                });
                
            }
        )
   } catch (error) {
      return Response.status(400).send({error: error});
   }
   
}

const updateUser = async(Request, Response) => {
    const id = parseInt(Request.params.id)
    const { password, username,
        first_name, last_name, email,name
    } = Request.body
    try {
        
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("User not found")
            return Response.status(400).json({
                result:"User not found",
           })
        }

        pool.query('UPDATE users_user SET password = $1, username = $2, first_name = $3, last_name = $4, email = $5,name = $6 WHERE id = $7 RETURNING *',
            [password, username,first_name, last_name, email,name,id], (error, results) =>{
            if (error){
                throw error
            }
            Response.status(200).send({
                status: `User with id ${id} has been modified`,
                result: results.rows[0]
            })
        }

    )

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }
    

    
}

const deleteUser = async(Request, Response) => {
    const id = parseInt(Request.params.id)

    try {
        
        const results = await getbyid(id)
        if (!Array.isArray(results.rows) || !results.rows.length){
            console.log("User not found")
            return Response.status(400).json({
                result:"User not found",
           })
        }

        pool.query('DELETE FROM users_user WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            Response.status(200).json({result:`User with id ${id} has been deleted successfully`})
        })

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }

    
}

const login = async(Request,Response) => {
    const { email, password} = Request.body;

    if(!email || !password){
        return Response.status(400).send({
            result:"Please fill all fields"
        })
    }

    if(!Helper.isValidEmail(email)){
        return Response.status(400).send({
            result:"Email is invalid"
        })
    }

    try {
            let user = await retrieveUserByEmail(email);
            if(!Array.isArray(user.rows) || !user.rows.length){
                return Response.status(400).send({
                    result:"Wrong login credentials"
                })
            }
            const DbPassword = user.rows[0].password;
            if (!Helper.comparePassword(password,DbPassword)){
                return Response.status(400).send({
                    result:"Wrong password"
                })
            }
            const id = user.rows[0].id;
            user = await setLoginTime(id)
            return Response.status(200).send({
                status:"Successfully logged in",
                result: user.rows[0]
            })

    } catch (error) {
        return Response.status(400).json({
            error: error})
    }
}

function setLoginTime(id){
    const loginTime = 'NOW'
    return new Promise((res, rej) => {
        pool.query('UPDATE users_user SET last_login = $1 WHERE id = $2 RETURNING *',[loginTime,id], (err, result) => {
            if (err) return rej(err)
            res(result)
        })
    })
}

function retrieveUserByEmail(email) {
    return new Promise((res, rej) => {
        pool.query('SELECT * FROM users_user WHERE email = $1', [email], (err, result) => {
          if (err) return rej(err)
          res(result)  
          
        })
    })
}


function getbyid(id) {
    return new Promise((res, rej)=> {
        pool.query('SELECT * FROM users_user WHERE id = $1', [id], (err, result) => {
            if (err) return rej(err)
            res(result)
        }
    )    
    })
}

module.exports = {
    getUsers,getUserById,
    createUser,updateUser,
    deleteUser,login
}