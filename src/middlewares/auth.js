export const authAdmin = (req,res,next) => {
    const token = "xyzadmin";
    const isAuthorized = token === "xyzadmin";
    if(!isAuthorized){
        res.status(401).send("Unauthorized user!!!");
    }else{
        next();
    }
}

