package com.infinity;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import io.wazo.callkeep.RNCallKeepModule; 
import androidx.annotation.NonNull;
import android.os.Bundle;

public class MainActivity extends ReactActivity {  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "infinity";
  }  
  
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
      case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
        RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
        break;
    }
   }    
}
