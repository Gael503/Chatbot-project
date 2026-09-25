"use client"
import { useEffect, useState } from "react";
import { chatService } from "@/services/chats/chats.service";
import { ContactsRequest, ContactResponse, Contact } from "@/services/chats/classes";
import CardContact from "../hooks/components/CardContact"
import { useForm } from "react-hook-form";
import { Loader } from "@/components/ui/loader";

export default function MessagesHome(){
    const [loading, setLoading] = useState<boolean>(true);
    const [contacts, setContacts] = useState<Contact[]>([])
    const defaultValues = new ContactsRequest();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<ContactsRequest>({ defaultValues })

    const searchContacts = async (request: ContactsRequest) => {
        setLoading(true)
        try {
            const resp: ContactResponse = await chatService.search(request);
            console.log(resp);
            if(!resp.success){
                console.log("Contactos no disponibles");
                return;
            }
            setContacts(resp.data)
        } catch (error) {
            setContacts([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() =>{
        searchContacts(defaultValues);
    },[])

    return (
        <div className="">
            Pagina de contactos
            {
                loading && <Loader />
            }
            {
                !loading && (
                    contacts.length ? (
                        contacts.map((contact, index) =>(
                            <CardContact key={index} id={contact.id} created_at={contact.created_at} phone={contact.phone}/>
                        ))
                    ) : <p> Contactos no disponibles</p>
                )
            }
        </div>
    )
}
