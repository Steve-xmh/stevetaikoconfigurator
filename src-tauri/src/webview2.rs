use std::io::Write;

use winsafe::{
    co::{DLGID, IDI, MB, PBS, WS},
    gui::{Label, LabelOpts, ProgressBar, ProgressBarOpts},
    prelude::*,
    SetProcessDPIAware,
};
use winsafe::{
    gui::{WindowMain, WindowMainOpts},
    HWND,
};

pub fn init() {
    if webview2::get_available_browser_version_string(None).is_ok() {
        return;
    }
    println!("No WebView2 runtime found, ask for installing...");

    let hwnd = HWND::GetDesktopWindow();

    let _ = SetProcessDPIAware();

    let result = hwnd
        .MessageBox(
            "\
    This system lacks WebView2 Runtime for this program.\n\
    Do you want to download and install WebView2 Runtime?\n\
    当前系统缺少运行本程序的 WebView2 运行时环境。\n\
    是否下载并安装运行时环境？\
    ",
            "Runtime Environment Required 需要安装运行环境",
            MB::APPLMODAL | MB::YESNO,
        )
        .expect("MessageBox failed");

    match result {
        DLGID::YES => {
            let progress_hwnd = WindowMain::new(WindowMainOpts {
                class_name: "WebView2 installation in progress".to_string(),
                class_icon: winsafe::gui::Icon::Idi(IDI::APPLICATION),
                title: "Installing WebView2 Runtime 正在安装 WebView2 运行时".to_string(),
                style: WS::CAPTION | WS::CLIPCHILDREN | WS::BORDER | WS::VISIBLE,
                size: (500, 80),
                ..Default::default()
            });

            let progress_text = Label::new(
                &progress_hwnd,
                LabelOpts {
                    text: "\
                    Downloading WebView2 Runtime Installer from Microsoft...\n\
                    正在从 Microsoft 下载 WebView2 运行时环境安装包……\
                    "
                    .to_string(),
                    position: (8, 8),
                    size: (500 - 8 * 2, 18 * 2),
                    ..Default::default()
                },
            );

            let progress_bar = ProgressBar::new(
                &progress_hwnd,
                ProgressBarOpts {
                    position: (8, 8 + 18 * 2 + 8),
                    size: (500 - 8 * 2, 80 - 18 * 2 - 8 * 3),
                    progress_bar_style: PBS::SMOOTH,
                    ..Default::default()
                },
            );

            let download_task = tauri::async_runtime::spawn({
                let progress_hwnd = progress_hwnd.clone();
                let progress_bar = progress_bar.clone();
                async move {
                    const WEBVIEW2_URL: &str = "https://go.microsoft.com/fwlink/p/?LinkId=2124703";

                    let dir = tempfile::tempdir()?;
                    println!("Created temp dir: {}", dir.path().to_string_lossy());
                    let file_path = dir.path().join("MicrosoftEdgeWebview2Setup.exe");
                    println!(
                        "Downloading WebView2 installer into: {}",
                        file_path.to_string_lossy()
                    );
                    let mut file = std::fs::File::create(&file_path)?;
                    let client = reqwest::Client::builder()
                        .user_agent("SteveTaikoConfigurator/0.0.1")
                        .build()?;

                    let file_size = {
                        let res = client.execute(client.head(WEBVIEW2_URL).build()?).await?;
                        dbg!(res.headers().get("Content-Length").unwrap())
                            .to_str()?
                            .parse::<u64>()?
                    };

                    println!("Downloading WebView2 installer with size: {}", file_size);

                    let mut res = client.execute(client.get(WEBVIEW2_URL).build()?).await?;

                    let mut downloaded_size = 0;
                    let mut progress = 0;
                    while let Some(chunk) = res.chunk().await? {
                        downloaded_size += chunk.len();
                        file.write_all(&chunk)?;

                        let new_progress =
                            (downloaded_size as f64 / file_size as f64 * 100.0) as u32;
                        if new_progress != progress {
                            progress = new_progress;

                            progress_hwnd.run_ui_thread({
                                let progress_text = progress_text.clone();
                                let progress_bar = progress_bar.clone();

                                move || {
                                    progress_text.set_text(&format!(
                                        "\
                                        Downloading WebView2 Runtime Installer from Microsoft... ({progress}%)\n\
                                        正在从 Microsoft 下载 WebView2 运行时环境安装包……\
                                        ",
                                    ));
                                    progress_bar.set_position(progress);
                                    Ok(())
                                }
                            });
                        }
                    }
                    file.sync_all()?;
                    drop(file);

                    progress_hwnd.run_ui_thread({
                        let progress_text = progress_text.clone();
                        let progress_bar = progress_bar.clone();

                        move || {
                            progress_text.set_text(
                                "\
                            Installing WebView2 Runtime...\n\
                            正在安装 WebView2 运行时环境……\
                            ",
                            );
                            progress_bar.set_marquee(true);
                            Ok(())
                        }
                    });

                    async_process::Command::new(file_path).status().await?;

                    drop(dir);
                    anyhow::Result::<()>::Ok(())
                }
            });

            tauri::async_runtime::spawn({
                let progress_hwnd = progress_hwnd.clone();
                async move {
                    let _ = dbg!(download_task.await);

                    progress_hwnd.run_ui_thread({
                        let progress_hwnd = progress_hwnd.clone();

                        move || {
                            progress_hwnd.close();
                            Ok(())
                        }
                    });
                }
            });

            progress_bar.set_marquee(true);

            let result = progress_hwnd.run_main(None).unwrap();
            println!("result: {:?}", result);
        }
        _ => {
            std::process::exit(1);
        }
    }

    if webview2::get_available_browser_version_string(None).is_err() {
        hwnd.MessageBox(
            "\
    Program failed to install WebView2 Runtime or the WebView2 Runtime is not detected!\n\
    Do you want to open WebView2 Runtime Installer download page for manual installation?\n\
    WebView2 运行环境安装失败或无法检测到 WebView2 环境！\n\
    是否打开 WebView2 运行时下载网站以手动安装？\
    ",
            "Runtime Environment not detected 未检测到运行环境",
            MB::APPLMODAL | MB::YESNO,
        )
        .expect("MessageBox failed");
        tauri_plugin_opener::open_url(
            "https://developer.microsoft.com/zh-cn/microsoft-edge/webview2",
            None::<&str>,
        )
        .unwrap();

        std::process::exit(1);
    }
}
