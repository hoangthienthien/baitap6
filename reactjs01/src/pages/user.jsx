import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (!res?.message) {
                setDataSource(res);
            } else {
                notification.error({ message: "Unauthorized", description: res.message });
            }
        }
        fetchUser();
    }, []);

    const columns = [
        { title: 'Id', dataIndex: '_id' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Role', dataIndex: 'role' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-6">User Accounts</h2>
                <Table bordered dataSource={dataSource} columns={columns} rowKey={"_id"} size="small" />
            </div>
        </div>
    )
}
export default UserPage;
