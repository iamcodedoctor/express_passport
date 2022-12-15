import express from "express";
const app = express();
import { connectDb, User } from "./db.js";
import ejs from "ejs";
import passport from "passport";
import { initilizingPassport, isAuthenticated } from "./passportConfig.js";
import expressSession from "express-session";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    expressSession({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Frontend get routes
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile");
});
app.get("/logout", (req, res, next) => {
    req.logout((err)=> {
       return next(err);
    })
    res.redirect('/')
   
});

// backend register routes

app.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/register",
        successRedirect: "/profile",
    })
);

app.post("/register", async (req, res) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = await User.create(req.body);
        return res.status(200).json(newUser);
    } catch (error) {
        res.status(500).next(error);
    }
});

connectDb();

initilizingPassport(passport);

app.use((err, req, res, next) => {
    if(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});
