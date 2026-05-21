/**
 * GCP Bucket keys — must match the keys in the backend's bucketMap.js constant.
 * bucketMap.js:
 *   CLIENT_DATA     -> "client-file"
 *   FREELANCER_DATA -> "freelancer-files"
 *   ADMIN_COLLECTION -> "admin-collection"
 */
export enum BucketKey {
  ClientData = 'CLIENT_DATA',
  FreelancerData = 'FREELANCER_DATA',
  AdminCollection = 'ADMIN_COLLECTION'
}

/**
 * Upload section names — must match the keys in the backend's uploadSections.js constant.
 * uploadSections.js:
 *   client.PROFILE_PHOTO      -> "profile-photo"
 *   freelancer.PROFILE_PHOTO  -> "profile-photo"
 *   freelancer.PORTFOLIO      -> "portfolio-files"
 *   freelancer.CONTRACT_FILES -> "contract-files"
 *   admin.BLOG_MEDIA          -> "blog-media"
 */
export enum UploadSection {
  ProfilePhoto = 'PROFILE_PHOTO',
  Portfolio = 'PORTFOLIO',
  ContractFiles = 'CONTRACT_FILES',
  BlogMedia = 'BLOG_MEDIA'
}
