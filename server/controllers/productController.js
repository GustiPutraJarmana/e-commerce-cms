/** @format */

"use strict";
const { Product } = require("../models");
const { User } = require("../models");
const { Op } = require("sequelize");

class productController {
  static create(req, res, next) {
    const userId = req.User.id;
    const body = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      image_url: req.body.image_url,
      stock: req.body.stock,
      price: req.body.price,
      UserId: userId
    };
    Product.create(body)
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => {
        next(err);
      });
  }

  static findAll(req, res, next) {
    Product.findAll()
      .then(data => {
        if (data.length) {
          res.status(200).json(data);
        } else {
          const error = {
            status: 404,
            msg: "data not found"
          };
          throw error;
        }
      })
      .catch(err => {
        next(err);
      });
  }

  static filterData(req, res, next) {
    const key = req.query.category;
    Product.findAll({
      where: {
        category: {
          [Op.like]: `%${key}%`
        }
      }
    })
      .then(data => {
        if (data.length) {
          res.status(200).json(data);
        } else {
          const error = {
            status: 404,
            msg: "data not found"
          };
          throw error;
        }
      })
      .catch(err => {
        next(err);
      });
  }

  static update(req, res, next) {
    const UserId = +req.User.id;
    console.log(UserId);
    const id = +req.params.id;
    console.log(id);
    const { name, description, image_url, price, stock, category } = req.body;
    Product.update(
      { name, description, image_url, price, stock, category },
      { where: { id: id, UserId: UserId }, returning: true }
    )
      .then(data => {
        if (data[1].length) {
          res.status(200).json(data[1]);
        } else {
          const error = {
            status: 404,
            msg: "data not found"
          };
          throw error;
        }
      })
      .catch(err => {
        next(err);
      });
  }

  static delete(req, res, next) {
    const UserId = +req.User.id
    const id = +req.params.id
    console.log('masukkkkkkkkkk')
    Product.destroy({where : {id, UserId}, returning : true})
      .then(data => {
        console.log(data)
        if (data > 0) {
          res.status(200).json('delete succesfull');
        } else {
          const error = {
            status: 404,
            msg: "data not found"
          };
          throw error;
        }
      })
      .catch(err => {
      next(err)
      })


  }
}

module.exports = productController;