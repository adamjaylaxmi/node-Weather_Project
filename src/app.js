const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

// setup Handlebars and views location
app.set('views',viewPath)
app.set('view engine','hbs')
hbs.registerPartials(partialPath)

// setup static directiory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index',{
        title:'Weather App',
        name:'Andrew Mead'
    })
})

app.get('/about',(req,res) =>{
    res.render('about',{
        title:'About me',
        name:'Andrew Mead'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        helpText:'This is some helpful text',
        title:'Help',
        name:'Andrew Mead'
    })
})

/*app.get('',(req,res) => {
    res.send('<h1>Weather</h1>')
})

app.get('/help',(req,res) => {
    res.send({
        name:'Andrew'
    })
})

app.get('/about',(req,res) =>{
    res.send('<h1> About </h1>')
}) */

app.get('/weather',(req,res) => {
    
    if(!req.query.address)
    {
        return res.send({
            error:'You must provide an address!'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            res.send({error})
        }

        forecast(latitude,longitude,(error,forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })
        
    /*res.send([
        {
            forecast:'It is snowing',
            location:'Philadelphia',
            address:req.query.address
        }
    ])*/
})

app.get('/products',(req,res) =>{

    if(!req.query.search){
        return res.send({
            error:'You must provide search'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res) =>{
    res.render('404',{
        title:'404',
        name:'Andrew Mead',
        errorMessage:'Help article not found'
    })
})

app.get('*',(req,res) =>{
    res.render('404',{
       title:'404',
       name:'Andrew Mead',
       errorMessage:'Page not found.' 
    })
})

app.listen(port,() =>{
    console.log('Server is up on port ',port)
})
