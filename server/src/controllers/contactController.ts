import { Request, Response } from "express";

import Contact from '../models/contactModel';
import CustomValidationError from "../lib/customValidationError";
import handleValidationError from "../lib/handleValidationError";
import validateRequestBody from "../lib/validateRequestBody";
import validateRequestUUID from "../lib/validateRequestUUID";

class ContactController {

    /**
     * Returns all contacts
     * 
     * Requires admin privileges
     */
    async findAll(req: Request, res: Response){
        try {
            const contacts = await Contact.findAll();

            res.status(200).json(contacts);
        } catch (error: any) {
            handleValidationError(error, res)
        }
    }

    /**
     * Returns a single contact
     * 
     * Requires admin privileges
     */
    async findOne(req: Request, res: Response){
        try {
            // validate the request params
            validateRequestUUID(req)
            
            // do the query
            const contact = await Contact.findOne({
                where: {
                    contact_id: req.params.contact_id
                },
                limit: 1,
                attributes:
                {
                    exclude: [
                    "contact_agrees_with_terms",
                    "contact_is_active",
                    "contact_is_solved",
                    "createdAt",
                    "updatedAt"
                ]
                }
            });

            // if the contact_id given in the request params doesn't exist, throw an error
            if (!contact) throw new CustomValidationError("Nenhum contato com o ID especificado foi encontrado.", req.params.contact_id);

            res.status(200).json(contact);
        } catch (error: any) {
            handleValidationError(error, res)
        }
    }

    async create(req: Request, res: Response){
        try {
            // validate the request body
            validateRequestBody(Contact, req);

            // create the contact
            await Contact.create(req.body);

            res.status(201).json({message: "Contact created"});
        } catch (error: any) {
            handleValidationError(error, res)
        }
    }

    async update(req: Request, res: Response){
        try {
            // validate the request body
            validateRequestBody(Contact, req);

            // check if the contact exists
            const contact = await Contact.findOne({
                where: {
                    contact_id: req.params.contact_id
                },
                limit: 1
            });

            // if the contact_id given in the request params doesn't exist, throw an error
            if (!contact) throw new CustomValidationError("Nenhum contato com o ID especificado foi encontrado.", req.params.contact_id);

            // update the contact
            await Contact.update(req.body, {
                where: {
                    contact_id: req.params.contact_id
                },
                limit: 1
            });

            res.status(200).json({message: "Contact updated"});
        } catch (error: any) {
            handleValidationError(error, res)
        }
    }

    async delete(req: Request, res: Response){
        try {
            throw new CustomValidationError("Não implementado. Delete.")
        } catch (error: any) {
            handleValidationError(error, res)
        }
    }

}

export default new ContactController();