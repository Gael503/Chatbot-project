"use client"
import { useEffect, useState } from "react";
import { chatService } from "@/services/chats/chats.service";
import { ContactsRequest, ContactResponse, Contact } from "@/services/chats/classes";
import CardContact from "../components/CardContact";
import { Loader } from "@/components/ui/loader";
import { PaginationControls } from "@/components/ui/pagination-controls";
import Pagination from "@/shared/Pagination";

function cloneRequest(request: ContactsRequest): ContactsRequest {
    const next = Object.assign(new ContactsRequest(), request)
    next.pagination = Object.assign(new Pagination(), request.pagination)
    return next
}

export default function ChatsHome(){
    const [loading, setLoading] = useState<boolean>(true);
    const [contacts, setContacts] = useState<Contact[]>([])
    const [infoRequest, setInfoRequest] = useState<ContactsRequest>(new ContactsRequest())
    const defaultValues = new ContactsRequest();

    const searchContacts = async (request: ContactsRequest) => {
        setLoading(true)
        try {
            const resp: ContactResponse = await chatService.search(request);
            if(!resp.success || !resp.data){
                setContacts([])
                setInfoRequest(request)
                return;
            }
            setContacts(resp.data.contacts)
            const nextRequest = cloneRequest(request)
            nextRequest.pagination = Object.assign(new Pagination(), resp.data.pagination)
            setInfoRequest(nextRequest)
        } catch (error) {
            setContacts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() =>{
        searchContacts(defaultValues);
    },[])

    const handlePageChange = (page: number) => {
        const request = cloneRequest(infoRequest)
        request.pagination.page = page
        searchContacts(request)
    }

    const handleSizeChange = (size: number) => {
        const request = cloneRequest(infoRequest)
        request.pagination.size = size
        request.pagination.page = 1
        searchContacts(request)
    }

    return (
        <div className="">
            Pagina de contactos
            {
                loading && <Loader />
            }
            {
                !loading && (
                    contacts.length ? (
                        <>
                            <div className="flex flex-wrap">
                                {contacts.map((contact, index) =>(
                                    <CardContact key={index} id={contact.id} created_at={contact.created_at} phone={contact.phone}/>
                                ))}
                            </div>
                            <PaginationControls
                                pagination={{
                                    page: infoRequest.pagination.page,
                                    size: infoRequest.pagination.size,
                                    totalPages: infoRequest.pagination.totalPages,
                                    totalRecords: infoRequest.pagination.total,
                                    onPageChange: handlePageChange,
                                    onSizeChange: handleSizeChange,
                                    loading,
                                }}
                            />
                        </>
                    ) : <p> Contactos no disponibles</p>
                )
            }
        </div>
    )
}
