"use client"
import { useEffect, useState } from "react";
import { chatService } from "@/services/chats/chats.service";
import { ContactsRequest, ContactResponse, Contact } from "@/services/chats/classes";
import CardContact from "../components/CardContact";
import { Loader } from "@/components/ui/loader";
import { PaginationControls } from "@/components/ui/pagination-controls";
import Pagination from "@/shared/Pagination";
import { cloneRequest, handlePageChange, handleSizeChange } from "@/components/utils/pagination"
import { useTranslations } from "next-intl";
import NotFound from "@/components/ui/notFound";

const newRequest = () => new ContactsRequest()

export default function ChatsHome(){
    const t = useTranslations(); 
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
            const nextRequest = cloneRequest(newRequest, request)
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

    const onPageChange = (page: number) => handlePageChange(newRequest, infoRequest, page, searchContacts)
    const onSizeChange = (size: number) => handleSizeChange(newRequest, infoRequest, size, searchContacts)

    return (
        <div>
            {
                loading && <Loader />
            }
            {
                !loading && (
                    <div>
                        <div className="my-4 bg-gray-50 rounded-2xl p-3">
                            <p className="font-bold">{t("chats.title")}</p>
                        </div>
                        {
                            contacts.length ? (
                                <>
                                    <div className="h-140 overflow-y-auto flex flex-wrap flex-3 pt-5">
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
                                            onPageChange,
                                            onSizeChange,
                                            loading,
                                        }}
                                    />
                                </>
                            ) : <NotFound message={t('chats.messages.contacts_not_found')}/>
                        }
                    </div>
                )
            }
        </div>
    )
}
