"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyContact = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const identifyContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    //fetch existing contacts with matching email or phoneNumber
    const existingContacts = yield prisma.contact.findMany({
        where: {
            OR: [
                { email: email !== null && email !== void 0 ? email : undefined },
                { phoneNumber: phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : undefined }
            ]
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    let primaryContact = null;
    // if no contact found , create new PRIMARY contact
    if (existingContacts.length === 0) {
        const newContact = yield prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedPrecedence: "primary"
            }
        });
        return res.json({
            contact: {
                primaryContactId: newContact.id,
                email: [email],
                phoneNumber: [phoneNumber],
                secondaryContactIds: []
            }
        });
    }
    //identify primary contact for matches
    const primaryCandidates = existingContacts.filter(c => c.linkedPrecedence === "primary");
    primaryContact = primaryCandidates.length > 0 ? primaryCandidates[0] : existingContacts[0];
    // Ensure only one primary exists; demote any others
    for (const contact of primaryCandidates) {
        if (contact.id !== primaryContact.id) {
            yield prisma.contact.update({
                where: { id: contact.id },
                data: {
                    linkedPrecedence: "secondary",
                    linkedId: primaryContact.id
                }
            });
        }
    }
    // Get full cluster of linked contacts
    const allLinkedContacts = yield prisma.contact.findMany({
        where: {
            OR: [
                { id: primaryContact.id },
                { linkedId: primaryContact.id }
            ]
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    //Determine if new secondary contact is needed
    const existingEmails = new Set(allLinkedContacts.map(c => c.email).filter(Boolean));
    const existingPhones = new Set(allLinkedContacts.map(c => c.phoneNumber).filter(Boolean));
    const isNewEmail = email && !existingEmails.has(email);
    const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber);
    if (isNewEmail || isNewPhone) {
        yield prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkedPrecedence: "secondary"
            }
        });
    }
    // Re-fetch updated cluster 
    const finalContacts = yield prisma.contact.findMany({
        where: {
            OR: [
                { id: primaryContact.id },
                { linkedId: primaryContact.id }
            ]
        }
    });
    const emails = Array.from(new Set(finalContacts.map(c => c.email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean)));
    const secondaryContactIds = finalContacts.filter(c => c.linkedPrecedence == 'secondary').map(c => c.id);
    res.json({
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    });
});
exports.identifyContact = identifyContact;
