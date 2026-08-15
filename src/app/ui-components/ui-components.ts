import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../library/ui/layouts/sidebar/sidebar';

import { Accordion } from '../library/ui/components/accordion/accordion';
import { Alert } from '../library/ui/components/alert/alert';
import { Badge } from '../library/ui/components/badge/badge';
import { Button } from '../library/ui/components/button/button';
import { Chip } from '../library/ui/components/chip/chip';
import { Dropdown } from '../library/ui/components/dropdown/dropdown';
import { InputField } from '../library/ui/components/input-field/input-field';
import { Loader } from '../library/ui/components/loader/loader';
import { Modal } from '../library/ui/components/modal/modal';
import { Pagination } from '../library/ui/components/pagination/pagination';
import { Table } from '../library/ui/components/table/table';
import { Toast } from '../library/ui/components/toast/toast';

import { Timeline } from '../library/shared/components/timeline/timeline';
import { ProfileAvatar } from '../library/shared/components/profile-avatar/profile-avatar';
import { NotificationDropdown } from '../library/shared/components/notification-dropdown/notification-dropdown';
import { FileUpload } from '../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../library/shared/components/file-preview/file-preview';

import { UserNavbar } from '../library/ui/layouts/user-navbar/user-navbar';

@Component({
  selector: 'app-ui-components',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    UserNavbar,
    Accordion, Alert, Badge, Button, Chip, Dropdown, InputField, Loader, Modal, Pagination, Table, Toast,
    Timeline, ProfileAvatar, NotificationDropdown, FileUpload, FilePreview
  ],
  templateUrl: './ui-components.html',
  styleUrl: './ui-components.css'
})
export class UiComponents {

}
