const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const customer = require('./src/controllers/customer')
const customerbeneficiary = require('./src/controllers/customerbeneficiary')
const user = require('./src/controllers/user')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (Request,Response) => {
    Response.json({ info: 'PSA Advisor Api'})
    }
)

app.get('/customer', customer.getCustomer)
app.get('/customer/:id', customer.getCustomerById)
app.post('/customer', customer.createCustomer)
app.put('/customer/:id', customer.updateCustomer)
app.delete('/customer/:id', customer.deleteCustomer)

app.get('/customerbeneficiary', customerbeneficiary.getCustomerBeneficiary)
app.get('/customerbeneficiary/:id', customerbeneficiary.getCustomerBeneficiaryById)
app.post('/customerbeneficiary', customerbeneficiary.createCustomerBeneficiary)
app.put('/customerbeneficiary/:id', customerbeneficiary.updateCustomerBeneficiary)
app.delete('/customerbeneficiary/:id', customerbeneficiary.deleteCustomerBeneficiary)

app.get('/user', user.getUsers)
app.get('/user/:id', user.getUserById)
app.post('/user/signup', user.createUser)
app.put('/user/:id', user.updateUser)
app.delete('/user/:id', user.deleteUser)
app.post('/user/login', user.login)

app.listen(port, () => {
    console.log('App running on port %d.',port)
    }
)