const express = require('express');
const router = express.Router();


//Importation du module de connexion à la bd
const dbConnection = require('../modules/db-connection');

router.get('/produit/list', (req, res)=>{
   const sql = 'SELECT * FROM produits';
   dbConnection.query(
      sql, 
      (err, rows) =>{
         if(err){
            res.json({error: err});
         } else {
            const params = {
               pageTitle: 'Liste des produits',
               numberOfProducts: rows.length,
               productList: rows
            }
            res.render('test', params);
         }
   });
});

router.get('/produit/form', (req,res)=>{
   res.render('form');
});

router.post('/produit/form', (req,res)=> {
   const sql = "INSERT INTO produits SET ?";
   const insertData = {
      designation: req.body.designation,
      prix: req.body.prix,
      qte_stockee: req.body.qte_stockee
   };

   dbConnection.query(
      sql,
      insertData,
      (err) =>{
         if(err) throw error;
         res.redirect('/produit/list');
      }
   )
});

router.get('/produit/delete/:id', (req, res) =>{
   const sql = 'DELETE FROM produits WHERE id_produit=?';

   dbConnection.query(
      sql,
      [req.params.id],
      (err)=>{
         if(err) throw err;

         res.redirect('/produit/list');
      }
   );

});

router.get('/produit/update/:id', (req, res)=>{
   const sql = 'SELECT * FROM produits WHERE id_produit=?'

   dbConnection.query(
      sql,
      [req.params.id],
      (err, data)=> {
         if(err) throw err;

         console.log(data);
         const params = {product: data[0]}

            console.log(params);

         res.render('form',params);
      }
   );
});
router.post('/produit/update/:id', (req,res)=> {
   const sql = "UPDATE produits SET designation=?,prix=?,qte_stockee=? WHERE id_produit=?";
   const Data =[ 
      req.body.designation,
      req.body.prix,
      req.body.qte_stockee,
      req.params.id
];

   dbConnection.query(
      sql,
      Data,
      (err) =>{
         if(err) throw err;
         res.redirect('/produit/list');
      }
   )
});

router.get('/login', (req,res)=> {
   res.render('login');
});

router.post('/login', (req, res)=> {
const sql= "SELECT * FROM utilisateurs WHERE pseudo=? AND mdp=?";
dbConnection.query(
   sql,
   [req.body.pseudo,req.body.mdp],
   (err,data)=>{
      if(err) throw err;

      if(data.length){
         res.redirect("/produit/list");
      } else{
         res.redirect("/login");
      }
   }
)
});
module.exports = router;