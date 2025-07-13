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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.contact.deleteMany(); // Clean slate
        yield prisma.contact.create({
            data: {
                email: 'lorraine@hillvalley.edu',
                phoneNumber: '123456',
                linkedPrecedence: 'primary',
            }
        });
        yield prisma.contact.create({
            data: {
                email: 'mcfly@hillvalley.edu',
                phoneNumber: '123456',
                linkedPrecedence: 'secondary',
                linkedId: 1
            }
        });
        yield prisma.contact.create({
            data: {
                email: 'biffsucks@hillvalley.edu',
                phoneNumber: '717171',
                linkedPrecedence: 'primary',
            }
        });
        yield prisma.contact.create({
            data: {
                email: 'george@hillvalley.edu',
                phoneNumber: '919191',
                linkedPrecedence: 'primary',
            }
        });
    });
}
main()
    .then(() => console.log("✅ Seeded DB"))
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
