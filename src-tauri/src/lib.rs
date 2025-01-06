use std::{
    ffi::CString,
    sync::{Mutex, RwLock},
};

use hidapi::{HidApi, HidDevice, HidError};
use tauri::{ipc::InvokeError, Manager, State};

type HidApiState = RwLock<HidApi>;
type HidDeviceState = Mutex<Option<HidDevice>>;

#[tauri::command]
fn send_feature_report_to_hid(
    hid_device: State<HidDeviceState>,
    hid: State<HidApiState>,
    value: Vec<u8>,
) -> Result<(), InvokeError> {
    let mut hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    if let Some(device) = hid_device.as_mut() {
        let info = device.get_device_info().map_err(InvokeError::from_error)?;
        let path = info.path();
        if !hid
            .read()
            .map_err(InvokeError::from_error)?
            .device_list()
            .any(|d| d.path() == path)
        {
            return Err(InvokeError::from_anyhow(anyhow::anyhow!(
                "device not found or not opened"
            )));
        }

        println!("send_feature_report_to_hid: {:?}", value);

        dbg!(device
            .send_feature_report(&value)
            .map_err(InvokeError::from_error)?);
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
    hid: State<HidApiState>,
    report_id: u8,
) -> Result<Vec<u8>, InvokeError> {
    let mut hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    if let Some(device) = hid_device.as_mut() {
        let info = device.get_device_info().map_err(InvokeError::from_error)?;
        let path = info.path();
        if !hid
            .read()
            .map_err(InvokeError::from_error)?
            .device_list()
            .any(|d| d.path() == path)
        {
            return Err(InvokeError::from_anyhow(anyhow::anyhow!(
                "device not found or not opened"
            )));
        }

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
    println!("device reopened: {}", device_path.to_string_lossy());
    Ok(())
}

#[tauri::command]
fn get_all_hids(hid: tauri::State<HidApiState>) -> Result<serde_json::Value, InvokeError> {
    let mut hid = hid.write().map_err(InvokeError::from_error)?;
    hid.reset_devices().map_err(InvokeError::from_error)?;

    hid.add_devices(0x303A, 0x456D)
        .map_err(InvokeError::from_error)?;

    Ok(serde_json::json!(hid
        .device_list()
        .map(|device| {
            serde_json::json!({
                "manufacturer": device.manufacturer_string(),
                "product": device.product_string(),
                "serialNumber": device.serial_number(),
                "vendorId": device.vendor_id(),
                "productId": device.product_id(),
                "path": device.path().to_string_lossy(),
            })
        })
        .collect::<Vec<_>>()))
}

#[tauri::command]
fn get_connected_hid(
    hid: State<HidApiState>,
    hid_device: tauri::State<HidDeviceState>,
) -> Result<serde_json::Value, InvokeError> {
    let hid_device = hid_device.lock().map_err(InvokeError::from_error)?;
    if let Some(device) = hid_device.as_ref() {
        match device.get_device_info() {
            Ok(info) => {
                let path = info.path();
                if !hid
                    .read()
                    .map_err(InvokeError::from_error)?
                    .device_list()
                    .any(|d| d.path() == path)
                {
                    return Ok(serde_json::Value::Null);
                }

                Ok(serde_json::json!({
                    "manufacturer": info.manufacturer_string(),
                    "product": info.product_string(),
                    "serialNumber": info.serial_number(),
                    "vendorId": info.vendor_id(),
                    "productId": info.product_id(),
                    "path": info.path().to_string_lossy(),
                }))
            }
            Err(_) => Ok(serde_json::Value::Null),
        }
    } else {
        Ok(serde_json::Value::Null)
    }
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
                use tauri_plugin_decorum::WebviewWindowExt;
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
            get_connected_hid,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
