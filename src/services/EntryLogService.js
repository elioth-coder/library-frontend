import Service from "./Service";
import { format } from "date-fns";

class EntryLogService extends Service {
    constructor() {
        super('entry_log');
    }

    async findFace(data) {
        let response = await fetch(`${this.api}/${this.table_name}/find_face`, {
            method: 'POST',
            credentials: 'include',
            body: data,
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async getAll() {
        let items = await super.getAll();

        return items.map(item => {
            let date = new Date(item.dt_logged);
            let timezoneOffset = date.getTimezoneOffset();
            let pstOffset = 480;
            let adjustedTime = new Date(date.getTime() + (pstOffset + timezoneOffset) * 60 * 1000);
            item.dt_logged = format(new Date(adjustedTime), 'yyyy-MM-dd hh:mm:ss a');
            return item;
        });
    }

}

export default EntryLogService;