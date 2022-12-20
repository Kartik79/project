const express=require("express")
const app=express()
const router=express.Router()
const db=require("./database")
const bcrypt=require("bcrypt")
const bodyParser = require('body-parser')
const session=require("express-session")
const path=require("path")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
  }));
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res, next) =>{
  res.render("main.ejs", { title: "dashboard",session : req.session });
});
app.post("/", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username && password) {
        query = `SELECT * FROM Armoury_caretaker WHERE emp_id = "${username}"`;
        db.query(query, function(error, data){
            if(data.length > 0) {
                for(var count = 0; count < data.length; count++) {
                    if(data[count].emp_pass == password) {
                        req.session.userid = data[count].userid;
                        res.redirect('/dash');
                    }
                    else {
                        res.send('Incorrect Password');
                    }
                }
            }
            else {
                res.send('Incorrect Userid');
            }
            res.end();
        });
    }
    else {
        res.send('Please Enter Userid and Password Details');
        res.end();
    }
});
app.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});
app.use(express.urlencoded({extended:false}))
app.post("/signup", function(req,res) {
    try {
        var user_pass= req.body.password   
        var username = req.body.username
        var name= req.body.name
        var confirm_pass=req.body.confirmpassword
        if(user_pass && username && confirm_pass) {
            var query=`SELECT * FROM Armoury_caretaker WHERE emp_id = "${username}"`
            db.query(query, function(err, data) {
                if(data.length > 0) {
                    res.send("Username already exists")
                }
                else {
                    if(user_pass==confirm_pass) {
                        var sql = `INSERT INTO Armoury_caretaker (emp_id,emp_name,emp_pass) VALUES ("${username}","${name}","${user_pass}")`
                        db.query(sql, function (err, result) {
                            if (err) throw err
                            console.log('Row has been updated')
                            res.redirect('/signup_update')
                        })
                    }
                    else {
                        res.send("Confirm password should be same as password")
                    }
                }
            })
        }
        else {
            res.send("Please enter Userid, Name and Password")
        }
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.post("/guns",async(req,res) => {
    try {
        var mp_id= req.body.mp_id   
        var gun = req.body.gun
        var serial=req.body.serial
        var amm_used=req.body.amm_used
        var sql = `INSERT INTO Guns (Type_of_guns , serial_no , type_of_ammunition_used,mp_id) VALUES ("${gun}","${serial}","${amm_used}","${mp_id}")`
        db.query(sql, function (err, result) {
            if (err) throw err
            console.log('Row has been updated')
            res.redirect('/deposit')
        })
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.post("/ammunition",async(req,res) => {
    try {
        var mp_id= req.body.mp_id   
        var bullet = req.body.bullet
        var serial=req.body.serial
        var no_box=req.body.no_box
        var gun = req.body.gun 
        var sql = `INSERT INTO Ammunitions(Type_of_bullets , serial_no , no_of_boxes , type_of_gun,mp_id ) VALUES ("${bullet}","${serial}","${no_box}","${gun}","${mp_id}")`
        db.query(sql, function (err, result) {
            if (err) throw err
            console.log('Row has been updated')
            res.redirect('/deposit')
        })
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.post("/gears",async(req,res) => {
    try {
        var mp_id= req.body.mp_id   
        var serial=req.body.serial
        var safety_gear=req.body.safety_gear
        var sql = `INSERT INTO SafetyGears(Type_of_gear  , serial_no ,mp_id) VALUES ("${safety_gear}","${serial}","${mp_id}")`
        db.query(sql, function (err, result) {
            if (err) throw err
            console.log('Row has been updated')
            res.redirect('/deposit')
        })
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.post("/grenade",async(req,res) => {
    try {
        var mp_id= req.body.mp_id   
        var serial=req.body.serial
        var grenade=req.body.grenade
        var sql = `INSERT INTO Grenades(Type_of_grenade  , serial_no ,mp_id) VALUES ("${grenade}","${serial}","${mp_id}")`
        db.query(sql, function (err, result) {
            if (err) throw err
            console.log('Row has been updated')
            res.redirect('/deposit')
        })
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.post("/withdrawal",async(req,res) => {
    try {
        var mp_id= req.body.mp_id   
        var bullet = req.body.bullet
        var serial=req.body.serial
        var no_ammo=req.body.no_ammo
        var grenade_serial= req.body.grenade_serial
        var no_grenade = req.body.no_grenade 
        var gear_serial = req.body.gear_serial
        var no_gear = req.body.no_gear
        var emp_id = req.body.emp_id   
        
        var sql = `INSERT INTO withdrawals(gun_serialno , ammunition_serial_no , quantity_of_ammunition , grenade_serialno  , quantity_of_grenade , safetygear_serialno,no_gear, mp_id , issued_by_empid) VALUES ("${serial}","${bullet}","${no_ammo}","${grenade_serial}","${no_grenade}","${gear_serial}","${no_gear}","${mp_id}","${emp_id}")`
        db.query(sql, function (err, result) {
            if (err) throw err
            console.log('Row has been updated')
            res.redirect('/dash')
        })
    } catch(err) {
        console.log(err)
        alert(err)
    }
})
app.get('/dash',(req,res) => {
    res.render("dashboard.ejs")
})
app.get('/signup',(req,res) => {
    res.render("signup.ejs")
})    
app.get('/guns',(req,res)=> {
    res.render("deposit_guns.ejs")
})
app.get('/ammunition',(req,res)=> {
    res.render("deposit_ammunition.ejs")
})
app.get('/gear',(req,res)=> {
    res.render("deposit_gears.ejs")
})
app.get('/grenade',(req,res)=> {
    res.render("deposit_grenade.ejs")
})
app.get('/withdrawal',(req,res)=> {
    res.render("withdrawal.ejs")
})
app.get('/deposit',(req,res)=> {
    res.render("deposit.ejs")
})
app.get('/signup_update',(req,res)=> {
    res.render("signup_update.ejs")
})
app.get('/Update_personnel',(req,res)=> {
    res.render("Update_personnel.ejs")
})
app.get('/records',(req,res)=> {
    res.render("view_records.ejs")
})
app.get('/guns_view',(req, res) => {
    var query="SELECT * FROM Guns"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("guns_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.get('/ammunition_view',(req, res) => {
    var query="SELECT * FROM Ammunitions"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("ammunition_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.get('/gear_view',(req, res) => {
    var query="SELECT * FROM SafetyGears"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("gear_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.get('/grenade_view',(req, res) => {
    var query="SELECT * FROM Grenades"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("grenade_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.get('/withdrawal_view',(req, res) => {
    var query="SELECT * FROM withdrawals"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("withdrawal_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.get('/personnel_view',(req, res) => {
    var query="SELECT * FROM Military_Personnel"
    db.query(query,function(err, data) {
        if(err) {
            throw err 
        }
        else {
            res.render("personnel_view.ejs", {title:'Viewing Records',action:'list',sampleData:data}) 
        }
    });
});
app.post('/Update_personnel',async(req,res) => {
    let mp_id=req.body.mp_id
    let batallion_no=req.body.batallion_no
    let name=req.body.name
    let address=req.body.address
    let mobile=req.body.mobile
    let dname=req.body.dname
    let bdate=req.body.bdate
    let sql = `UPDATE Military_Personnel
           SET mp_name = "${name}", mp_batallion_no = "${batallion_no}", home_address = "${address}", Bdate = "${bdate}", phone_no = "${mobile}", Dependent_name = "${dname}"
           WHERE mp_id = "${mp_id}"`;

    let data = [false, 1];

    db.query(sql, data, (error, results, fields) => {
    if (error){
        return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    res.redirect('/signup_update')
});
})
app.listen(3000)
module.exports=app