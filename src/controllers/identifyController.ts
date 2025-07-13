import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  //fetch existing contacts with matching email or phoneNumber
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email ?? undefined },
        { phoneNumber: phoneNumber ?? undefined }
      ]
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  let primaryContact = null;

  // if no contact found , create new PRIMARY contact

  if (existingContacts.length === 0) {

    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedPrecedence: "primary"
      }
    })

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        email: [email],
        phoneNumber: [phoneNumber],
        secondaryContactIds: []
      }
    })
  }

  //identify primary contact for matches

  const primaryCandidates = existingContacts.filter(c => c.linkedPrecedence === "primary");
  primaryContact = primaryCandidates.length > 0 ? primaryCandidates[0] : existingContacts[0];


  // Ensure only one primary exists; demote any others

  for (const contact of primaryCandidates){
    if(contact.id !== primaryContact.id){
      
      await prisma.contact.update({
        where:{id:contact.id} , 
        data:{
          linkedPrecedence : "secondary" , 
          linkedId : primaryContact.id
        }
      })
    }
  }

  // Get full cluster of linked contacts

  const allLinkedContacts = await prisma.contact.findMany({
    where:{
      OR:[
        {id:primaryContact.id} , 
        {linkedId: primaryContact.id}
      ]
    }, 
    orderBy:{
      createdAt:'asc'
    }
  })

  //Determine if new secondary contact is needed

  const existingEmails = new Set(allLinkedContacts.map(c=> c.email).filter(Boolean)) ; 

  const existingPhones = new Set(allLinkedContacts.map(c=> c.phoneNumber).filter(Boolean)) ; 

  const isNewEmail = email && !existingEmails.has(email) ; 
  const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber) ;

  if(isNewEmail || isNewPhone){
    
    await prisma.contact.create({
      data:{
        email , 
        phoneNumber, 
        linkedId: primaryContact.id , 
        linkedPrecedence : "secondary"
      }
    })
  }

  // Re-fetch updated cluster 

  const finalContacts = await prisma.contact.findMany({
    where:{
      OR:[
        {id: primaryContact.id}, 
        {linkedId : primaryContact.id}
      ]
    }
  })

  const emails = Array.from(new Set(finalContacts.map(c=>c.email).filter(Boolean)))

  const phoneNumbers = Array.from(new Set(finalContacts.map(c=>c.phoneNumber).filter(Boolean)))

  const secondaryContactIds = finalContacts.filter(c=> c.linkedPrecedence == 'secondary').map(c=> c.id); 

  res.json({
    contact:{
      primaryContactId : primaryContact.id , 
      emails , 
      phoneNumbers ,
      secondaryContactIds
    }
  })

};


