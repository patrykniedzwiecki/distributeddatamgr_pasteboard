/*
* Copyright (c) 2022 Huawei Device Co., Ltd.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

#include "parcel_util.h"
namespace OHOS::MiscServices {
bool ParcelUtil::GetRawData(const Parcelable *value, uintptr_t &data, size_t &size)
{
    if (value == nullptr) {
        return false;
    }
    Parcel parcel(nullptr);
    bool ret = parcel.WriteParcelable(value);
    if (!ret) {
        return false;
    }
    data = parcel.GetData();
    size = parcel.GetDataSize();
    return true;
}
} // namespace OHOS::MiscServices