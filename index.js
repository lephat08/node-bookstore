const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
/*const db = require('./queries') */
const { request, response } = require('express')
var session = require('express-session');
const fileUpload = require('express-fileupload')

const { Pool } = require('pg')
const app = express()

app.use(fileUpload());
app.use(express.static("public"))
app.use(express.static("upload"))


var uuid = require('uuid')
var cookieParser = require('cookie-parser');
var MemoryStore =session.MemoryStore;
const port = 3000
/* const Pool = require('pg').Pool */
const expressLayouts = require('express-ejs-layouts')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api_db', 
    password: '123',
    port: 5432,
})

// Set Templating Engine
app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(expressLayouts)
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false })); // <--- middleware configuration
app.use(cookieParser());

app.use(session({
    name : 'app_crud',
    secret: "secret",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    res.locals.username = req.session.username;
    next();
});

// app.get('/', requiresLogin,(request,response) => {
//     //response.json({info: 'Node js, Express, Postgres API'})
//     response.render("index");
// });

//api
app.get('/api/book',(req,res)=>{  
    pool.query('SELECT * FROM _book_store',(err,rows)=>{  
    if(!err)   
        res.send(rows);  
    else  
        console.log(err);  
      
    }); 
});



app.get('/', requiresLogin,(request,response) => {
    const sql ="SELECT * FROM _book_store ORDER BY _book_id"
    pool.query(sql,[],(err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("index",{model:result.rows});
    });
});

app.get('/detail/:id',requiresLogin,(req,res) => {
    const id = req.params.id;
    const sql = "SELECT _book_company,_book_loai,_book_sku,_book_nxb,_book_page FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err, result) => {
        if (err){
           return console.error(err.message);
        }
        res.render("book_info",{model:result.rows});

       });
});

app.post("/detail/:id",(request,response) =>{
    const id = request.params.id;
    const sql = "SELECT _book_company,_book_loai,_book_sku,_book_nxb,_book_page FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        // response.redirect("/info");
        // response.send('<script>alert("Đã xóa thành công !")</script>');
        response.redirect("/book_info");
    });
        
});

app.get('/about', requiresLogin,(request,response) => {
    response.render("about");
});

app.get('/data', requiresLogin, (request,response) => {
    const sql = "SELECT * FROM users_test ORDER BY id"
    pool.query(sql,[],(err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("data",{model:result.rows });
    });
});

app.get('/info', requiresLogin, (request,response) => {
    const sql = "SELECT * FROM users_test ORDER BY id"
    pool.query(sql,[],(err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("info",{model:result.rows });
    });
});

// GET /edit/5
app.get("/edit/:id", requiresLogin, (request, response) => {
    const id = request.params.id;
    const sql = "SELECT * FROM users_test WHERE id = $1";
    pool.query(sql, [id], (err, result) => {
     if (err){
        return console.error(err.message);
     }
     response.render("edit", { model: result.rows[0] });
    });
  });

//POST /edit/id
app.post("/edit/:id", (request, response) => {
    const id = request.params.id;
    const user = [request.body.name, request.body.email, request.body.city, request.body.country, id];
    const sql = "UPDATE users_test SET name = $1, email = $2, city = $3, country = $4 WHERE (id = $5)";
    pool.query(sql, user, (err, result) => {
        if(err){
            return console.error(err.message);
        }
        response.redirect("/info");
    });
});

//Cap nhat user và csdl
app.get("/create",requiresLogin, (request, response) => {
    response.render("create", {model: {} });
});

app.post("/create",(request,response) => {
    const sql = "INSERT INTO users_test (name,email,city,country) VALUES ($1,$2,$3,$4)";
    const adduser = [request.body.name, request.body.email, request.body.city, request.body.country];
    pool.query(sql, adduser, (err, result) => {
        if(err){
            return console.error(err.message);
        }
        response.redirect("/info");
    });
});

//Xoa user khoi csdl
app.get("/delete/:id", requiresLogin, (request,response) =>{
    const id = request.params.id;
    const sql = "SELECT * FROM users_test WHERE id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("delete",{model: result.rows[0]});
    });
});

app.post("/delete/:id",(request,response) =>{
    const id = request.params.id;
    const sql = "DELETE FROM users_test WHERE id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.redirect("/info");
    });
});

//login page

app.get('/login', function(request, response) {
    response.render("login", {layout: 'layout_null'});
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;

    if(username != undefined && password != undefined){   
        console.log(username);
        console.log(password);
        var sql = "SELECT * FROM users_account WHERE username = $1 AND password = $2";
        pool.query(sql,[username,password],function(err,result){
            console.log(result.rowCount);
            if (result.rowCount === 0) {
                // response.render("login");
                response.send('<script> window.confirm("Bạn nhập sai username hoặc passowrd"); window.location.href = ("/login"); </script>');
                request.session.destroy();
            }else {
                request.session.id = true;
                request.session.username = username;
                response.redirect("/");
            }
        });
    }
});

app.get('/home', requiresLogin, (request,response) => {
    if (request.session.id) {
		response.render("index");
	} else {
		response.send('Làm ơn đăng nhập hộ bố mày cái !');
	}
	response.end();
     //response.json({info: 'Node js, Express, Postgres API'})
     
});

// GET /logout
app.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
        req.session.destroy(function(err) {
        if(err) {
            return next(err);
        } else {
            return res.redirect('/');
        }
        });
    }
});

//Thông tin sách


app.get('/book',requiresLogin,function(request,response,next){
    const sql = "SELECT * FROM _book_store ORDER BY _book_id DESC"
    pool.query(sql,[],(err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("book",{model:result.rows });
    });
});


app.get("/bookcreate",requiresLogin, (request, response) => {
    response.render("book_create", {model: {} });
});


app.post("/bookcreate", (req, res) => {
        let samplefile;
        let uploadpath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('Không có file để upload!!!.');
        }
         
        samplefile = req.files.samplefile;
        uploadpath = __dirname + '/upload/' + samplefile.name;
        console.log(samplefile);
         
        samplefile.mv(uploadpath,function(err){
            if(err) return res.status(500).send(err);
            const sql = "INSERT INTO _book_store (_book_title, _book_content, _book_image, _book_price,_book_company,_book_loai,_book_page,_book_sku,_book_nxb) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
            const addimg = [req.body.ten, req.body.noidung,samplefile.name,req.body.price,req.body.company,req.body.loai,req.body.page,req.body.sku,req.body.nxb];
            pool.query(sql, addimg, (err, result) => {
                if(err){
                    return console.error(err.message);
                }
                res.redirect("/book");
            });

            // res.send('Upload thành công !');
        });
         
});

app.get("/editbook/:id", requiresLogin, (request, response) => {
    const id = request.params.id;
    const sql = "SELECT * FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err, result) => {
     if (err){
        return console.error(err.message);
     }
     response.render("book_edit", { model: result.rows[0] });
    });
  });

//POST /edit/id
app.post("/editbook/:id", (request, response) => {
    const _book_id = request.params.id;
    // let samplefile;
    // let uploadpath;

    // if (!request.files || Object.keys(request.files).length === 0) {
    //     return response.status(400).send('Không có file để upload!!!.');
    // }
     
    // samplefile = request.files.samplefile;
    // uploadpath = __dirname + '/upload/' + samplefile.name;
    // console.log(samplefile);
     
    // samplefile.mv(uploadpath,function(err){
    //     if(err) return response.status(500).send(err);
        const addimg = [request.body.ten, request.body.noidung, request.body.price,request.body.company, request.body.loai, request.body.page, request.body.nxb, request.body.sku, _book_id];
        const sql = "UPDATE _book_store SET _book_title = $1, _book_content = $2, _book_price = $3, _book_company = $4, _book_loai = $5, _book_page = $6, _book_nxb = $7, _book_sku = $8 WHERE (_book_id = $9)";       
        pool.query(sql, addimg, (err, result) => {
            if(err){
                return console.error(err.message);
            }
            response.redirect("/book");
        });

        // res.send('Upload thành công !');
    // });

});

app.get("/deletebook/:id", requiresLogin, (request,response) =>{
    const id = request.params.id;
    const sql = "SELECT * FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("book_delete",{model: result.rows[0]});
    });
});


app.post("/deletebook/:id",(request,response) =>{
    const id = request.params.id;
    const sql = "DELETE FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        // response.redirect("/info");
        // response.send('<script>alert("Đã xóa thành công !")</script>');
        response.redirect("/book");
    });
        
});

app.get('/bookdetail/:id',requiresLogin,function(request,response,next){
    const id = request.params.id;
    const sql = "SELECT * FROM _book_store WHERE _book_id = $1 ";
    pool.query(sql,[id],(err,result) => {
        if(err){
            return console.error(err.message);
        }
        response.render("book_detail",{model:result.rows[0] });
    });
});

app.post("/bookdetail/:id",(request,response) =>{
    const id = request.params.id;
    const sql = "SELECT * FROM _book_store WHERE _book_id = $1";
    pool.query(sql, [id], (err,result) => {
        if(err){
            return console.error(err.message);
        }
        // response.redirect("/info");
        // response.send('<script>alert("Đã xóa thành công !")</script>');
        response.redirect("/book_detail");
    });
        
});


app.post("/addComment",(request,response) => {
    const sql = "INSERT INTO _book_comment (user_cm, content_cm) VALUES ($1,$2)";
    const addcomment = [request.body.username, request.body.comnent];
    pool.query(sql, addcomment, (err, result) => {
        if(err){
            return console.error(err.message);
        }
        response.send('<script>alert("Đã cập nhật comment vào csdl !");window.location.href="/";</script>');
    });
});


app.get("/search",(request,response) => {
    var search = request.body.search;
    const sql = "SELECT * FROM _book_store WHERE _book_title = $1";
    pool.query(sql,[search],(err,result) =>{
        if(err){
            return console.error(err.message);
        }
        response.render("book_search",{title:'Search Book',searchData: result.rows});
         // response.send("test find");
    });
 });





// middleware
function requiresLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        return res.redirect('/login')
    }
}

app.listen(port, () => {
    console.log('server đang chạy trên (http://localhost:3000/login))')
})

