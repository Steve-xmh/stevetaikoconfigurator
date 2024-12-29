use std::{
    ffi::CString,
    sync::{Mutex, RwLock},
};

use hidapi::{HidApi, HidDevice};
use tauri::{ipc::InvokeError, Manager, State};
use tauri_plugin_decorum::WebviewWindowExt;

type HidApiState = RwLock<HidApi>;
type HidDeviceState = Mutex<Option<HidDevice>>;

#[tauri::command]
fn send_feature_report_to_hid(
    hid_device: State<HidDeviceState>,
    value: &[u8],
) -> Result<(), InvokeError> {
    let mut hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    if let Some(device) = hid_device.as_mut() {
        device
            .send_feature_report(value)
            .map_err(InvokeError::from_error)?;
    } else {
        return Err(InvokeError::from_anyhow(anyhow::anyhow!(
            "device not found or not opened"
        )));
    }
    Ok(())
}

#[tauri::command]
fn recv_feature_report_from_hid(
    hid_device: State<HidDeviceState>,
    report_id: u8,
) -> Result<Vec<u8>, InvokeError> {
    let mut hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    if let Some(device) = hid_device.as_mut() {
        let mut buf = [0u8; 64]; // HID 最大报告长度
        buf[0] = report_id;
        let size = device
            .get_feature_report(&mut buf)
            .map_err(InvokeError::from_error)?;
        Ok(buf[..size].to_vec())
    } else {
        Err(InvokeError::from_anyhow(anyhow::anyhow!(
            "device not found or not opened"
        )))
    }
}

#[tauri::command]
fn reopen_device(
    hid: State<HidApiState>,
    hid_device: State<HidDeviceState>,
    device_path: String,
) -> Result<(), InvokeError> {
    let hid = hid.read().map_err(InvokeError::from_error)?;
    let mut hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    let device_path = CString::new(device_path).map_err(InvokeError::from_error)?;
    let device = hid
        .open_path(device_path.as_c_str())
        .map_err(InvokeError::from_error)?;
    *hid_device = Some(device);
    Ok(())
}

#[tauri::command]
fn get_all_hids(hid: tauri::State<HidApiState>) -> Result<serde_json::Value, tauri::Error> {
    let mut hid = hid
        .write()
        .map_err(|_| anyhow::anyhow!("error while mutating HID manager"))?;
    hid.reset_devices().unwrap();
    hid.add_devices(0x0F0D, 0x00C1).unwrap();
    hid.add_devices(0x303A, 0x456D).unwrap();

    Ok(serde_json::json!(hid
        .device_list()
        .map(|device| {
            serde_json::json!({
                "manufacturer": device.manufacturer_string(),
                "product": device.product_string(),
                "serialNumber": device.serial_number(),
                "vendorId": device.vendor_id(),
                "productId": device.product_id(),
                "path": device.path().to_str().ok(),
            })
        })
        .collect::<Vec<_>>()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_decorum::init())
        .manage(HidApiState::new(
            HidApi::new().expect("error while initializing HID manager"),
        ))
        .manage(HidDeviceState::default())
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            {
                let main_window = _app.get_webview_window("main").unwrap();
                main_window.set_traffic_lights_inset(16.0, 20.0).unwrap();
                main_window.make_transparent().unwrap();
                let main_window_clone = main_window.clone();
                main_window.on_window_event(move |evt| {
                    if let tauri::WindowEvent::Resized(_) = evt {
                        main_window_clone
                            .set_traffic_lights_inset(16.0, 20.0)
                            .unwrap();
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            send_feature_report_to_hid,
            recv_feature_report_from_hid,
            get_all_hids,
            reopen_device,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
