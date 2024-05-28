import {Task} from '@divviup/dap/dist/task'
import axios from 'axios'

export const visitAnalytic = async() => {
  try {
    const token = localStorage.getItem("access_token")
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/global-setting/ANALYTICS`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.data.enabled) {
      const task = new Task({
        type: "count",
        id: "_H7Q4ZnynSlGQHUZy1sMe5H_iawVIcuzkKZmYRQceWY",
        leader: "https://dap-09-3.api.divviup.org/",
        helper: "https://helper-dap-09.shira.app/",
        timePrecisionSeconds: 300
      });

      await task.sendMeasurement(true);          
    }
  } catch (e) {
    console.log("🚀 ~ visitAnalytic ~ e:", e)
  } 
}