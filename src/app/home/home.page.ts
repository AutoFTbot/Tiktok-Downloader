import { Component } from '@angular/core';
import { TikTokService } from '../services/tiktok.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { Toast } from '@capacitor/toast';
import { showNotification } from '../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  videoUrl: string = '';
  videoData: any;
  isLoading: boolean = false;

  constructor(private tiktokService: TikTokService, private http: HttpClient) {}

  async getVideoData() {
    this.isLoading = true;
    await Toast.show({ text: 'Downloading video...' });
    showNotification('Download Started', 'Your video is downloading...');

    this.tiktokService.downloadVideo(this.videoUrl).subscribe(async data => {
      this.videoData = data.result;
      await this.downloadVideo(this.videoData.video[0]);
    }, async error => {
      this.isLoading = false;
      await Toast.show({ text: 'Error downloading video' });
      console.error('Error downloading video', error);
    });
  }

  async downloadVideo(videoUrl: string) {
    const response = await this.http.get(videoUrl, { responseType: 'blob' }).toPromise();
    if (!response) {
      this.isLoading = false;
      await Toast.show({ text: 'Error downloading video' });
      console.error('Error downloading video: response is undefined');
      return;
    }
    const base64Data = await this.convertBlobToBase64(response) as string;

    const fileName = `tiktok_video_${new Date().getTime()}.mp4`;
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data.split(',')[1],
      directory: Directory.Documents,
      recursive: true
    });

    this.isLoading = false;
    await Toast.show({ text: 'Video saved to Downloads folder' });
    console.log('Video saved to Downloads folder');
  }

  convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => {
        if (reader.result === null) {
          reject('Error converting blob to base64: result is null');
        } else {
          resolve(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    });
  }
}